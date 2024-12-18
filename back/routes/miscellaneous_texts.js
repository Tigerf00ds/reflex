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

const miscSchema = {
    type: "object",
    properties: {
        text: {type: "string"},
        filesdescriptions: {
            type: "array",
            items: { type: "string" }
            }
    },
    required: ["text", "filesdescriptions"],
    additionalProperties: false
}
const miscValidate = ajv.compile(miscSchema);

const descriptionRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ,.:!?$€£¥)(\s\-']{1,255}$/;

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM miscellaneous_texts';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.put('/update/:id', upload.array('images', 12), async (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit.' });
    // }
    if(!miscValidate(req.body, miscSchema)){
        console.log(miscValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: miscValidate.errors });
    }
    const { text, filesdescriptions } = req.body;
    const { id } = req.params;
    if(!text){
        console.error('Texte invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Texte invalide.' });
    }
    if(id===1 && !text.match(descriptionRegex)){
        console.error('Texte invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Texte invalide.' });
    }
    if(!filesdescriptions){
        console.error('Description des images invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description des images invalide.' });
    }
    const filespaths = req.files ? req.files.map(file => file.path) : [];
    const filesnames = req.files ? req.files.map(file => file.filename) : [];
    const sql = 'UPDATE miscellaneous_texts SET text = ?, filespaths = ?, filesnames = ?, filesdescriptions = ? WHERE id = ?';
    db.query(sql, [he.encode(text), JSON.stringify(filespaths), JSON.stringify(filesnames), JSON.stringify(filesdescriptions), id], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Texte modifié avec succès' });
    });
});

module.exports = router;