const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const addMinutes = require('../modules/addMinutes.js');
const he = require('he');
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
      time_start: {type: "integer"},
      duration: {type: "integer"}
    },
    required: ["care_id", "address", "name", "email", "telephone", "date_booked", "time_start", "duration" ],
    additionalProperties: false
}
const appointmentsValidate = ajv.compile(appointmentsSchema);

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM appointments ORDER BY date_booked DESC, time_start DESC';
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
    const { care_id, address, name, email, telephone, date_booked, time_start, duration } = req.body;
    const dateToday = new Date();
    const yearToday = dateToday.getFullYear();
    const monthToday = dateToday.getMonth()+1;
    const nextMonth = monthToday===12?1:monthToday+1;
    const dayToday = dateToday.getDate();
    if(isNaN(care_id)){
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
    if(isNaN(time_start)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(!duration || isNaN(duration)){
        console.error('Durée invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée invalide.' });
    }
    const time_end = addMinutes(time_start, duration);
    const time_depart = address==="salon"||time_start===0?time_start:addMinutes(time_start-100,30);
    const time_return = address==="salon"||time_start===0?time_end:addMinutes(time_end,30);
    let price = 0;
    const sql1 = 'SELECT * FROM cares WHERE id = ?';
    db.query(sql1, [care_id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length>0)price += results[0].price / 60 * duration;
        if(results.length>0 && address!=='salon')price += results[0].travel_expenses;
    });
    const dateArray = date_booked.split('-');
    if(yearToday > parseInt(dateArray[0])){
        console.error('Année invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Année invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday > parseInt(dateArray[1])){
        console.error('Mois invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mois invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1]) && dayToday >= parseInt(dateArray[2])){
        console.error('Jour invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Jour invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1])){
        console.error('Date invalide pour un jour complet.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide pour un jour complet.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && nextMonth === parseInt(dateArray[1]) && dayToday > parseInt(dateArray[2])){
        console.error('Date invalide pour un jour complet.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide pour un jour complet.' });
    }
    const sql2 = 'SELECT * FROM appointments WHERE date_booked = ?';
    db.query(sql2, [he.encode(date_booked)], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        const overlapping = results.some(result => 
            result.time_return > time_depart && result.time_depart < time_return
        );
        if(overlapping) {
        console.error('Créneau déjà pris.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Créneau déjà pris.' });
        }
        const sql3 = 'INSERT INTO appointments (care_id, address, name, email, telephone, date_booked, time_depart, time_start, time_end, time_return, price) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        db.query(sql3, [care_id, he.encode(address), he.encode(name), he.encode(email), he.encode(telephone), he.encode(date_booked), time_depart, time_start, time_end, time_return, price], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            //TODO mailer
            return res.status(200).send({ message: 'Rendez-vous pris avec succès', name: name });
        });
    });
});

router.put('/update/:id',  async (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit' });
    // }
    if(!appointmentsValidate(req.body, appointmentsSchema)){
        console.log(appointmentsValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: appointmentsValidate.errors });
    }
    const { care_id, address, name, email, telephone, date_booked, time_start, duration } = req.body;
    const { id } = req.params;
    const dateToday = new Date();
    const yearToday = dateToday.getFullYear();
    const monthToday = dateToday.getMonth()+1;
    const nextMonth = monthToday===12?1:monthToday+1;
    const dayToday = dateToday.getDate();
    if(isNaN(care_id)){
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
    if(isNaN(time_start)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(!duration || isNaN(duration)){
        console.error('Durée invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Durée invalide.' });
    }
    const time_end = addMinutes(time_start, duration);
    const time_depart = address==="salon"||time_start===0?time_start:addMinutes(time_start-100,30);
    const time_return = address==="salon"||time_start===0?time_end:addMinutes(time_end,30);
    let price = 0;
    const sql1 = 'SELECT * FROM cares WHERE id = ?';
    db.query(sql1, [care_id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length>0)price += results[0].price / 60 * duration;
        if(results.length>0 && address!=='salon')price += results[0].travel_expenses;
    });
    const dateArray = date_booked.split('-');
    if(yearToday > parseInt(dateArray[0])){
        console.error('Année invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Année invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday > parseInt(dateArray[1])){
        console.error('Mois invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mois invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1]) && dayToday >= parseInt(dateArray[2])){
        console.error('Jour invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Jour invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1])){
        console.error('Date invalide pour un jour complet.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide pour un jour complet.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && nextMonth === parseInt(dateArray[1]) && dayToday > parseInt(dateArray[2])){
        console.error('Date invalide pour un jour complet.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide pour un jour complet.' });
    }
    const sql2 = 'SELECT * FROM appointments WHERE date_booked = ? AND id != ?';
    db.query(sql2, [he.encode(date_booked), id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        const overlapping = results.some(result => 
            result.time_return > time_depart && result.time_depart < time_return
        );
        if(overlapping) {
        console.error('Créneau déjà pris.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Créneau déjà pris.' });
        }
        const sql3 = 'UPDATE appointments SET care_id = ?, address = ?, name = ?, email = ?, telephone = ?, date_booked = ?, time_depart = ?, time_start = ?, time_end = ?, time_return = ?, price = ? WHERE id = ?';
        db.query(sql3, [care_id, he.encode(address), he.encode(name), he.encode(email), he.encode(telephone), he.encode(date_booked), time_depart, time_start, time_end, time_return, price, id], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            //TODO mailer
            return res.status(200).send({ message: 'Rendez-vous modifié avec succès', name: name });
        });
    });
});

router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.session.user!=="admin"){
        return res.status(401).json({ error: 'Interdit' });
    }
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
        //TODO mailer
        return res.status(200).json({ message: 'Rendez-vous effacé avec succès' });
    });
});

module.exports = router;