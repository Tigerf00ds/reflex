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
  const mailOptions1 = {
    from: req.body.email,
    to: 'franck@gmail.com',
    subject: "Réservation",
    text: "Nom : " + req.body.nom  
    +"\nPrenom : "+ req.body.prenom 
    + "\nEmail : "+ req.body.email 
    + '\nTéléphone : ' +  req.body.phone
    + '\nAdresse : ' +  req.body.address 
    + '\nCode postal: ' +  req.body.zipCode
    + '\nType de la prestation: ' +  req.body.type
    + '\nLieu de la prestation : ' +  req.body.location
    + '\nDate : ' +  new Date(req.body.date).toLocaleDateString()
  };

  // Envoi du mail
  transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
      return res.status(500).send({ error : 'Erreur lors de l\'envoi du mail au professionnel'});
    }
  });

  const mailOptions2 = {
    from: "franck@gmail.com",
    to: req.body.email,
    subject: "Réservation",
    text: "Bonjour " + req.body.prenom
    + "\nVotre reservation a bien été prise en compte.",   
  };

  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      return res.status(500).send({ error : 'Erreur lors de l\'envoi du mail au client'});
    } else {
      return res.status(200).send('Mail envoyé avec succès')
    }
  });
});

module.exports = router;
