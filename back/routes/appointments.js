const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
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
      time_depart: {type: "integer"},
      time_start: {type: "integer"},
      time_end: {type: "integer"},
      time_return: {type: "integer"}
    },
    required: ["care_id", "address", "name", "email", "telephone", "date_booked", "time_depart", "time_start", "time_end", "time_return" ],
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
    const { care_id, address, name, email, telephone, date_booked, time_depart, time_start, time_end, time_return } = req.body;
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
    if(isNaN(time_depart)){
        console.error('Temps de départure invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de départure invalide.' });
    }
    if(isNaN(time_start)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(isNaN(time_end)){
        console.error('Temps de fin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de fin invalide.' });
    }
    if(isNaN(time_return)){
        console.error('Temps de retour invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de retour invalide.' });
    }
    if(time_start >= time_end){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    if(time_depart > time_start){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    if(time_end > time_return){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    const dateArray = date_booked.split('-');
    if(yearToday > parseInt(dateArray[0])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday > parseInt(dateArray[1])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1]) && dayToday >= parseInt(dateArray[2])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && nextMonth === parseInt(dateArray[1]) && dayToday > parseInt(dateArray[2])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    const sql1 = 'SELECT * FROM appointments WHERE date_booked = ?';
    db.query(sql1, [eh(date_booked)], (err, results) => {
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
        const sql2 = 'INSERT INTO appointments (care_id, address, name, email, telephone, date_booked, time_depart, time_start, time_end, time_return) VALUES (?,?,?,?,?,?,?,?,?,?)';
        db.query(sql2, [care_id, eh(address), eh(name), eh(email), eh(telephone), eh(date_booked), time_depart, time_start, time_end, time_return], (err, results) => {
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
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Forbidden.' });
    // }
    if(!appointmentsValidate(req.body, appointmentsSchema)){
        console.log(appointmentsValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: appointmentsValidate.errors });
    }
    const { care_id, address, name, email, telephone, date_booked, time_depart, time_start, time_end, time_return } = req.body;
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
    if(isNaN(time_depart)){
        console.error('Temps de départure invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de départure invalide.' });
    }
    if(isNaN(time_start)){
        console.error('Temps de début invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de début invalide.' });
    }
    if(isNaN(time_end)){
        console.error('Temps de fin invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de fin invalide.' });
    }
    if(isNaN(time_return)){
        console.error('Temps de retour invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps de retour invalide.' });
    }
    if(time_start >= time_end){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    if(time_depart > time_start){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    if(time_end > time_return){
        console.error('Temps invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Temps invalide.' });
    }
    const dateArray = date_booked.split('-');
    if(yearToday > parseInt(dateArray[0])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday > parseInt(dateArray[1])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1]) && dayToday >= parseInt(dateArray[2])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && monthToday === parseInt(dateArray[1])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    if(time_start === 0 && time_end === 2400 && yearToday === parseInt(dateArray[0]) && nextMonth === parseInt(dateArray[1]) && dayToday > parseInt(dateArray[2])){
        console.error('Date invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Date invalide.' });
    }
    const sql1 = 'SELECT * FROM appointments WHERE date_booked = ? AND id != ?';
    db.query(sql1, [eh(date_booked), id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        console.log(results);
        const overlapping = results.some(result => 
            result.time_return > time_depart && result.time_depart < time_return
        );
        if(overlapping) {
        console.error('Créneau déjà pris.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Créneau déjà pris.' });
        }
        const sql2 = 'UPDATE appointments SET care_id = ?, address = ?, name = ?, email = ?, telephone = ?, date_booked = ?, time_depart = ?, time_start = ?, time_end = ?, time_return = ? WHERE id = ?';
        db.query(sql2, [care_id, eh(address), eh(name), eh(email), eh(telephone), eh(date_booked), time_depart, time_start, time_end, time_return, id], (err, results) => {
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
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Forbidden.' });
    // }
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