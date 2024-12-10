const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const he = require('he');
const Ajv = require('ajv');
const ajv = new Ajv();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
const upload = multer({ storage, fileFilter });

const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;
const descriptionRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;
const formatSlug = (text) =>{
    text = text.toString();
    text = text.replace(/[àáâäãÀÁÂÄÃ]/g,'a');
    text = text.replace(/[ìíîïÌÍÎÏ]/g,'i');
    text = text.replace(/[ùúûüÙÚÛÜ]/g,'u');
    text = text.replace(/[èéêëÈÉÊË]/g,'e');
    text = text.replace(/[òóôöõÒÓÔÖÕ]/g,'o');
    text = text.replace(/[ýÿÝŸ]/g,'y');
    text = text.replace(/[æÆ]/g,'ae');
    text = text.replace(/[œŒ]/g,'oe');
    text = text.replace(/[ñÑ]/g,'n');
    text = text.replace(/[çÇ]/g,'c');
    text = text.replace(/[ß]/g,'ss');
    text = text.replace(/[\s']/g,'-');
    text = text.toLowerCase();
    return text;
}

const caresSchema = {
    type: "object",
    properties: {
      name: {type: "string"},
      short_description: {type: "string"},
      description: {type: "string"},
      min_duration: {type: "integer"},
      max_duration: {type: "integer"},
      price: {type: "integer"},
      tax: {type: "integer"},
      travel_expenses: {type: "integer"},
      is_whole_day: {type: "boolean"},
      is_home: {type: "boolean"},
      is_salon: {type: "boolean"},
      is_company: {type: "boolean"},
      is_structure: {type: "boolean"},
      filesdescriptions: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["name", "short_description", "description", "min_duration", "max_duration", "price", "tax", "travel_expenses", "is_whole_day", "is_home", "is_salon", "is_company", "is_structure", "filesdescriptions"],
    additionalProperties: false
}
const caresValidate = ajv.compile(caresSchema);

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM cares';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.get('/:slug', (req, res) => {
    const { slug } = req.params;
    const sql = 'SELECT * FROM cares WHERE slug = ?';
    db.query(sql, [slug], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.post('/create', upload.array('images', 12), async (req, res) => {
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Forbidden.' });
    // }
    if(!caresValidate(req.body, caresSchema)){
        console.log(caresValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: caresValidate.errors });
    }
    const { name, short_description, description, min_duration, max_duration, price, tax, travel_expenses, is_whole_day, is_home, is_salon, is_company, is_structure, filesdescriptions } = req.body;
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!short_description || !short_description.match(descriptionRegex)){
        console.error('Description courte invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description courte invalide.' });
    }
    if(!description){
        console.error('Description invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description invalide.' });
    }
    if(!min_duration || isNaN(min_duration)){
        console.error('Durée minimale invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée minimale invalide.' });
    }
    if(!max_duration || isNaN(max_duration)){
        console.error('Durée maximale invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée maximale invalide.' });
    }
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!tax || isNaN(tax)){
        console.error('TVA invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'TVA invalide.' });
    }
    if(!travel_expenses || isNaN(travel_expenses)){
        console.error('Frais de déplacement invalides.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Frais de déplacement invalides.' });
    }
    if(!filesdescriptions){
        console.error('Description des images invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description des images invalide.' });
    }
    const slug = formatSlug(name);
    const filespaths = req.files ? req.files.map(file => file.path) : [];
    const filesnames = req.files ? req.files.map(file => file.filename) : [];
    const sql1 = 'SELECT * FROM cares WHERE slug = ?';
    db.query(sql1, [slug], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        const sameSlug = results.some(result => 
            result.slug === slug
        );
        if(sameSlug) {
        console.error('Nom déjà pris.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom déjà pris.' });
        }
        const sql2 = 'INSERT INTO cares (name, slug, short_description, description, min_duration, max_duration, price, tax, travel_expenses, is_whole_day, is_home, is_salon, is_company, is_structure, filesnames, filespaths, filesdescriptions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        db.query(sql2, [he.encode(name), slug, he.encode(short_description), he.encode(description), min_duration, max_duration, price, tax, travel_expenses, is_whole_day, is_home, is_salon, is_company, is_structure, JSON.stringify(filesnames), JSON.stringify(filespaths), JSON.stringify(filesdescriptions)], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Soin créé avec succès', name: name });
        });
    });
});

router.put('/update/:id', upload.array('images', 12), async (req, res) => {
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Forbidden.' });
    // }
    if(!caresValidate(req.body, caresSchema)){
        console.log(caresValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: caresValidate.errors });
    }
    const { name, short_description, description, min_duration, max_duration, price, tax, travel_expenses, is_whole_day, is_home, is_salon, is_company, is_structure, filesdescriptions } = req.body;
    const { id } = req.params;
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!short_description || !short_description.match(descriptionRegex)){
        console.error('Description courte invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description courte invalide.' });
    }
    if(!description){
        console.error('Description invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description invalide.' });
    }
    if(!min_duration || isNaN(min_duration)){
        console.error('Durée minimale invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée minimale invalide.' });
    }
    if(!max_duration || isNaN(max_duration)){
        console.error('Durée maximale invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée maximale invalide.' });
    }
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!tax || isNaN(tax)){
        console.error('TVA invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'TVA invalide.' });
    }
    if(!travel_expenses || isNaN(travel_expenses)){
        console.error('Frais de déplacement invalides.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Frais de déplacement invalides.' });
    }
    if(!filesdescriptions){
        console.error('Description des images invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description des images invalide.' });
    }
    const slug = formatSlug(name);
    const filespaths = req.files ? req.files.map(file => file.path) : [];
    const filesnames = req.files ? req.files.map(file => file.filename) : [];
    const sql1 = 'SELECT * FROM cares WHERE slug = ? AND id != ?';
    db.query(sql1, [slug, id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        const sameSlug = results.some(result => 
            result.slug === slug
        );
        if(sameSlug) {
        console.error('Nom déjà pris.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom déjà pris.' });
        }
        const sql2 = 'UPDATE cares SET name = ?, slug = ?, short_description = ?, description = ?, min_duration = ?, max_duration = ?, price = ?, tax = ?, travel_expenses = ?, is_whole_day = ?, is_home = ?, is_salon = ?, is_company = ?, is_structure = ?, filesnames = ?, filespaths = ?, filesdescriptions = ? WHERE id = ?';
        db.query(sql2, [he.encode(name), slug, he.encode(short_description), he.encode(description), min_duration, max_duration, price, tax, travel_expenses, is_whole_day, is_home, is_salon, is_company, is_structure, JSON.stringify(filesnames), JSON.stringify(filespaths), JSON.stringify(filesdescriptions), id], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Soin modifié avec succès', name: name });
        });
    });
});

router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.session.user!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'DELETE FROM cares WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Soin effacé avec succès' });
    });
});

module.exports = router;