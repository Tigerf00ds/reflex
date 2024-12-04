const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const Ajv = require('ajv');
const ajv = new Ajv();
// penser à require utiliser escape-html ou he


//template ajv
// const schema = {
//     type: "object",
//     properties: {
//       foo: {type: "integer"},
//       bar: {type: "string"}
//     },
//     required: ["foo"],
//     additionalProperties: false
// }
// const validate = ajv.compile(schema);
// const data = {
//   foo: 1,
//   bar: "abc"
// }
// const valid = validate(data);
// if (!valid) console.log(validate.errors);
//template ajv


router.get('/', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    // en post empêcher uun array de passer quand une variable seule est attendue
    // req.name
    // if(Array.isArray(req.name)) req.name = req.name.pop();
    // en post limiter la taille max des requêtes
    // buffer = new Buffer.alloc(10);
    // buffer.write('string');
    // session dans le req.session
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

module.exports = router;