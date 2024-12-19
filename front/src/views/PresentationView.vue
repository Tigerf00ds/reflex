<script setup lang="ts"></script>

<template>
    <img src="../assets/pied.png" alt="présentation de Franck Bataille" >
</template>

<style scoped>
/* Global styles */
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  background-image: url("../assets/damier.png"); /* Image en arrière-plan */
  background-size: 100vw auto; /* Largeur à 100%, hauteur proportionnelle */
  background-repeat: repeat-y; /* Répétition verticale */
  background-position: center top; /* Aligné au centre et en haut */
}

/* Container pour structurer la page */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-image: url("../assets/bambino.png"), url("../assets/bambino.png"); /* Image à gauche et à droite */
  background-repeat: no-repeat;
  background-position: left center, right center; /* Place les images à gauche et à droite */
  background-size: 20% 100%; /* Ajuste la taille des images pour qu'elles occupent 20% de la largeur */
}

/* Formulaire de contact */
.contact-form {
  flex: 1; /* Prend tout l'espace disponible */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  background-image: url("../assets/damier.png"); /* Damier en arrière-plan */
  background-size: cover; /* Ajuste pour remplir tout l'écran */
  padding: 40px 20px;
  margin: 100px auto 0; /* Augmentation de la marge pour descendre davantage le formulaire */
  background-position: center; /* Centré */
}

.contact-form h1 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #000;
  margin-bottom: 40px;
  background-color: rgba(255, 255, 255, 0.8); /* Fond blanc semi-transparent */
  padding: 10px;
  border-radius: 5px;
}

/* Disposition en grille pour les champs */
form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2; /* Message prend toute la largeur */
}

.input-group label {
  font-weight: 700; /* Gras */
  color: #000; /* Noir */
  font-size: 18px;
}

.input-field,
.textarea {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border: 2px solid #234899; /* Bordure bleu foncé */
  border-radius: 8px; /* Coins arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre douce */
  background-color: rgba(255, 255, 255, 0.9); /* Fond blanc pour lisibilité */
}

.textarea {
  height: 150px;
  resize: none;
  flex-grow: 1; /* Permet au textarea de prendre plus de largeur */
  max-width: 100%; /* Assure que le champ ne dépasse pas */
}

/* Centrer le bouton "Envoyer" dans le formulaire */
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: span 2; /* Pour que le bouton prenne toute la largeur du formulaire */
  margin-top: 40px; /* Espacement du bouton par rapport aux champs */
}

/* Bouton "Envoyer" */
.submit-button {
  background-color: #234899;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre pour un effet de bouton */
  transition: background-color 0.3s, transform 0.2s; /* Animation lors de l'interaction */
}

.submit-button:hover {
  background-color: #1a376d; /* Couleur légèrement plus foncée */
  transform: scale(1.05); /* Effet d'agrandissement */
}

.submit-button:active {
  transform: scale(0.95); /* Effet d'enfoncement */
}
</style>
