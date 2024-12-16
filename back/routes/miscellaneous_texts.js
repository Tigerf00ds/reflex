const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const he = require('he');
const Ajv = require('ajv');
const ajv = new Ajv();

const miscSchema = {
    type: "object",
    properties: {
        text: {type: "string"}
    },
    required: ["text"],
    additionalProperties: false
}
const miscValidate = ajv.compile(miscSchema);

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM miscellaneous_texts';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.put('/update/:id', async (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit' });
    // }
    if(!miscValidate(req.body, miscSchema)){
        console.log(miscValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: miscValidate.errors });
    }
    const { text } = req.body;
    const { id } = req.params;
    if(!text){
        console.error('Texte invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Texte invalide.' });
    }
    const sql = 'UPDATE miscellaneous_texts SET text = ? WHERE id = ?';
    db.query(sql, [he.encode(text), id], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Texte modifié avec succès' });
    });
});

module.exports = router;