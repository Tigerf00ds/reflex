const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const he = require('he');
const Ajv = require('ajv');
const ajv = new Ajv();

const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const emailPassSchema = {
    type: "object",
    properties: {
      email: {type: "string"},
      password: {type: "string"}
    },
    required: ["email", "password"],
    additionalProperties: false
}
const emailPassValidate = ajv.compile(emailPassSchema);

router.get('/', (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit' });
    // }
    const sql = 'SELECT * FROM users';
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
    //     return res.status(401).json({ error: 'Interdit' });
    // }
    if(!emailPassValidate(req.body, emailPassSchema)){
        console.log(emailPassValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: emailPassValidate.errors });
    }
    const { email, password } = req.body;
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!password || !password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });
    }
    if(!password || !password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });
    }
    if(!password || !password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });
    }
    if(!password || !password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });
    }
    if(!password || !password.match(/[!@#$%^&*(),;.?:{}|<>]/)){
        console.error('Aucun caractère spécial dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun caractère spécial dans le mot de passe.' });
    }
    bcrypt.hash(he.encode(password), 10).then((hashedPassword) => {
        const sql = 'INSERT INTO users (email, password) VALUES (?,?)';
        db.query(sql, [he.encode(email), hashedPassword], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Compte administrateur créé avec succès' });
        });
    }).catch(err => {
        console.error('Erreur bcrypt :', err);
        return res.status(500).send({ error: 'Erreur de hachage' });
    });
});

router.post('/login', async (req, res) => {
    if (!emailPassValidate(req.body, emailPassSchema)){
        console.log(emailPassValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: 'E-mail ou mot de passe incorrect.' });
    }
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    if(!email || !email.match(emailRegex)){
        return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    db.query(sql, [he.encode(email)], async (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length<1){
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }
        const user = results[0];
        if(user.password && password){
            const isMatch = await bcrypt.compare(he.encode(password), user.password);
            if( typeof(password)!=='string' || !isMatch){
                return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
            }
        } else {
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }
        const token = jwt.sign({ id : user.id, role : 'admin'}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
        req.session.user = 'admin';
        return res.status(200).json({ message: "Connecté", id: user.id, token: token });
    });
});

router.put('/update/:id', async (req, res) => {
    // DÉSACTIVÉ POUR LE TEST
    // authorizationJWT
    // if(req.session.user!=="admin"){
    //     return res.status(401).json({ error: 'Interdit' });
    // }
    if(!emailPassValidate(req.body, emailPassSchema)){
        console.log(emailPassValidate.errors);
        return res.status(400).json({ error: 'Erreur type', details: emailPassValidate.errors });
    }
    const { email, password } = req.body;
    const { id } = req.params;
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!password || !password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });
    }
    if(!password || !password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });
    }
    if(!password || !password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });
    }
    if(!password || !password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });
    }
    if(!password || !password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
        console.error('Aucun caractère spécial dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun caractère spécial dans le mot de passe.' });
    }
    bcrypt.hash(he.encode(password), 10).then((hashedPassword) => {
        const sql = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
        db.query(sql, [he.encode(email), hashedPassword, id], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Compte administrateur modifié avec succès' });
        });
    }).catch(err => {
        console.error('Erreur bcrypt :', err);
        return res.status(500).send({ error: 'Erreur de hachage' });
    });
});

router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.session.user!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    if(id === 1){
        console.error('Erreur de requête à la base de donnée.');
        return res.status(500).json({ error: 'Erreur serveur', details: `Impossible d'effacer l'administrateur principal` });
    }
    const sql = 'DELETE FROM users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Compte administrateur effacé avec succès' });
    });
});

module.exports = router;