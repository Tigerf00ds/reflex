const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const he = require('he');
const Ajv = require('ajv');
const ajv = new Ajv();

const telRegex = /^[0-9]{10,13}$/;

const telephoneSchema = {
    type: "object",
    properties: {
        telephone: {type: "string"}
    },
    required: ["telephone"],
    additionalProperties: false
}
const telephoneValidate = ajv.compile(telephoneSchema);

router.get('/', (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit.' });
    // }
    const sql = 'SELECT * FROM banned_users';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.post('/create', async (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit.' });
    // }
    if(!telephoneValidate(req.body, telephoneSchema)){
        console.log(telephoneValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: telephoneValidate.errors });
    }
    const { telephone } = req.body;
    if(!telephone || !telephone.match(telRegex)){
        console.error('Téléphone invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    const sql1 = 'SELECT * FROM banned_users WHERE telephone = ?';
    db.query(sql1, [he.encode(telephone)], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length>0) {
        console.error('Utilisateur déjà banni.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Utilisateur déjà banni.' });
        }
        const sql2 = 'INSERT INTO banned_users (telephone) VALUES (?)';
        db.query(sql2, [he.encode(telephone)], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Compte banni' });
        });
    });
});

router.delete('/delete/:id', async (req, res) => {
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit.' });
    // }
    const { id } = req.params;
    const sql = 'DELETE FROM banned_users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Compte authorisé' });
    });
});

module.exports = router;