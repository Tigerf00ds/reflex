<script setup lang="ts"></script>

<template>
    <!-- Formulaire de réservation -->
    <div class="reservation-form">
      <h1>Réservation</h1>
      <form>
        <div class="form-grid">
          <div class="input-container">
            <label for="nom">Nom</label>
            <input id="nom" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="prenom">Prénom</label>
            <input id="prenom" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="email">Adresse mail</label>
            <input id="email" type="email" class="input-field" />
          </div>
          <div class="input-container">
            <label for="phone">Numéro de téléphone</label>
            <input id="phone" type="tel" class="input-field" />
          </div>
          <div class="input-container">
            <label for="type">Type de prestation</label>
            <select id="type" class="input-field">
              <option>Choisissez...</option>
            </select>
          </div>
          <div class="input-container">
            <label for="lieu">Lieu de la prestation</label>
            <select id="lieu" class="input-field">
              <option>Choisissez...</option>
            </select>
          </div>
          <div class="input-container">
            <label for="address">Adresse</label>
            <input id="address" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="postal">Code postal</label>
            <input id="postal" type="text" class="input-field" />
          </div>

          <!-- Conteneur pour le champ Date et bouton -->
          <div class="input-container date-container">
            <label for="date">Date du rendez-vous</label>
            <input id="date" type="date" class="input-field date-field" />
            <button type="submit" class="submit-button">Réserver</button>
          </div>
        </div>
      </form>
    </div>
</template>


<style scoped>
/* Formulaire de réservation */
.reservation-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-image: url("../assets/damier.png");
  background-size: cover;
  background-repeat: repeat;
  background-position: center;
  margin: 0 auto;
}

.reservation-form h1 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #000;
  margin-bottom: 40px;
  margin-top: 40px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.input-container {
  width: 100%;
  margin-bottom: 20px;
}

.input-container label {
  font-weight: bold;
  font-size: 16px;
  color: #000; /* Changer la couleur des étiquettes en noir */
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #234899;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #1a376d;
  box-shadow: 0 0 8px rgba(26, 55, 109, 0.4);
  outline: none;
}

.submit-button {
  background-color: #234899;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #1a376d;
  transform: scale(1.05);
}

.submit-button:active {
  transform: scale(0.95);
}

.date-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column: span 2;
}

.date-field {
  width: 150px;
  margin-right: 20px;
}
</style>
