const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  // Configuration de l'envoi de mail
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // ou true si vous utilisez SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Définition du contenu du mail
  const mailOptions = {
    from: req.body.email,
    to: 'franck@gmail.com',
    subject: req.body.objet,
    text: "Nom : " + req.body.nom + "\nPrenom : "+ req.body.prenom +  "\nEmail : "+ req.body.email +'\nMessage : ' +  req.body.message
  };

  // Envoi du mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ error: 'Erreur lors de l\'envoi du mail' });
    } else {
      console.log('Mail envoyé avec succès');
      return res.status(200).send('Mail envoyé avec succès');
    }
  });
});

module.exports = router;
