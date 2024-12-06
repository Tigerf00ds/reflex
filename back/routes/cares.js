const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const he = require('he');
const eh = require('escape-html');
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

const caresSchema = {
    type: "object",
    properties: {
      name: {type: "string"},
      short_description: {type: "string"},
      description: {type: "string"},
      price: {type: "integer"},
      tax: {type: "integer"},
      is_salon: {type: "boolean"},
      is_home: {type: "boolean"},
      is_company: {type: "boolean"},
      is_structure: {type: "boolean"},
      filesdescriptions: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["name", "short_description","description" , "price", "tax", "is_salon", "is_home", "is_company", "is_structure", "filesdescriptions"],
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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM cares WHERE id = ?';
    db.query(sql, [id], (err, results) => {
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
    const { name, short_description, description, price, tax, is_salon, is_home, is_company, is_structure, filesdescriptions } = req.body;
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
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!tax || isNaN(tax)){
        console.error('TVA invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'TVA invalide.' });
    }
    if(!filesdescriptions){
        console.error('Description des images invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description des images invalide.' });
    }
    const filespaths = req.files ? req.files.map(file => file.path) : [];
    const filesnames = req.files ? req.files.map(file => file.filename) : [];
    const sql = 'INSERT INTO cares (name, short_description, description, price, tax, is_salon, is_home, is_company, is_structure, filesnames, filespaths, filesdescriptions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [eh(name), eh(short_description), he.encode(description), price, tax, is_salon, is_home, is_company, is_structure, JSON.stringify(filesnames), JSON.stringify(filespaths), JSON.stringify(filesdescriptions)], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Soin créé avec succès', name: name });
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
    const { name, short_description, description, price, tax, is_salon, is_home, is_company, is_structure, filesdescriptions } = req.body;
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
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!tax || isNaN(tax)){
        console.error('TVA invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'TVA invalide.' });
    }
    if(!filesdescriptions){
        console.error('Description des images invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description des images invalide.' });
    }
    const filespaths = req.files ? req.files.map(file => file.path) : [];
    const filesnames = req.files ? req.files.map(file => file.filename) : [];
    const sql = 'UPDATE cares SET name = ?, short_description = ?, description = ?, price = ?, tax = ?, is_salon = ?, is_home = ?, is_company = ?, is_structure = ?, filesnames = ?, filespaths = ?, filesdescriptions = ? WHERE id = ?';
    db.query(sql, [eh(name), eh(short_description), he.encode(description), price, tax, is_salon, is_home, is_company, is_structure, JSON.stringify(filesnames), JSON.stringify(filespaths), JSON.stringify(filesdescriptions), id], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Soin modifié avec succès', name: name });
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