const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const Ajv = require('ajv');
const ajv = new Ajv();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

module.exports = router;