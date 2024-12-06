const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const eh = require('escape-html');
const Ajv = require('ajv');
const ajv = new Ajv();

const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const telRegex = /^[0-9]{10,13}$/;
const addressRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;
const dateRegex = /^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
const timeRegex = /^[0-9]{4}$/;

const appointmentsSchema = {
    type: "object",
    properties: {
      care_id: {type: "integer"},
      address: {type: "string"},
      name: {type: "string"},
      email: {type: "string"},
      telephone: {type: "string"},
      date_booked: {type: "string"},
      time_start: {type: "string"},
      time_booked: {type: "string"},
      time_end: {type: "string"}
    },
    required: ["care_id", "address", "name", "email", "telephone", "date_booked", "time_start", "time_booked", "time_end"],
    additionalProperties: false
}
const appointmentsValidate = ajv.compile(appointmentsSchema);

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM appointments ORDER BY date_booked DESC, time_booked DESC';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

router.post('/create', async (req, res) => {
    if(!appointmentsValidate(req.body, appointmentsSchema)){
        console.log(appointmentsValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: appointmentsValidate.errors });
    }
    const { care_id, address, name, email, telephone, date_booked, time_start, time_booked, time_end } = req.body;
    if(!care_id || isNaN(care_id)){
        console.error('Soin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Soin invalide.' });
    }
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!address || !address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone || !telephone.match(telRegex)){
        console.error('Téléphone invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!date_booked || !date_booked.match(dateRegex)){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(!time_start || !time_start.match(timeRegex)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(!time_booked || !time_booked.match(timeRegex)){
        console.error('Temps prévu invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps prévu invalide.' });
    }
    if(!time_end || !time_end.match(timeRegex)){
        console.error('Temps de fin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de fin invalide.' });
    }
    const sql = 'INSERT INTO appointments (care_id, address, name, email, telephone, date_booked, time_start, time_booked, time_end) VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(sql, [care_id, eh(address), eh(name), eh(email), eh(telephone), eh(date_booked), eh(time_start), eh(time_booked), eh(time_end)], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Rendez-vous pris avec succès', name: name });
    });
});

router.put('/update/:id', authorizationJWT, async (req, res) => {
    if(req.session.user!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    if(!appointmentsValidate(req.body, appointmentsSchema)){
        console.log(appointmentsValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: appointmentsValidate.errors });
    }
    const { care_id, address, name, email, telephone, date_booked, time_start, time_booked, time_end } = req.body;
    const { id } = req.params;
    if(!care_id || isNaN(care_id)){
        console.error('Soin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Soin invalide.' });
    }
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!address || !address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone || !telephone.match(telRegex)){
        console.error('Téléphone invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!date_booked || !date_booked.match(dateRegex)){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(!time_start || !time_start.match(timeRegex)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(!time_booked || !time_booked.match(timeRegex)){
        console.error('Temps prévu invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps prévu invalide.' });
    }
    if(!time_end || !time_end.match(timeRegex)){
        console.error('Temps de fin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de fin invalide.' });
    }
    const sql = 'UPDATE appointments SET care_id = ?, address = ?, name = ?, email = ?, telephone = ?, date_booked = ?, time_start = ?, time_booked = ?, time_end = ? WHERE id = ?';
    db.query(sql, [care_id, eh(address), eh(name), eh(email), eh(telephone), eh(date_booked), eh(time_start), eh(time_booked), eh(time_end), id], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Rendez-vous modifié avec succès', name: name });
    });
});

router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.session.user!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'DELETE FROM appointments WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Rendez-vous effacé avec succès' });
    });
});

module.exports = router;