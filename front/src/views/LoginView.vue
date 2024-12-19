<script setup lang="ts"></script>

<template>
    <!-- Formulaire de connexion -->
    <div class="login">
      <h1>Connexion</h1>
      <form>
        <div class="input-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre e-mail"
            class="input-field"
          />
        </div>
        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            class="input-field"
          />
        </div>
        <div class="button-container">
          <button type="submit" class="submit-button">Se connecter</button>
        </div>
        <div class="link-group">
          <p>Pas encore inscrit ? <a href="#">Créer un compte</a></p>
          <p><a href="#">Mot de passe oublié ?</a></p>
        </div>
      </form>
    </div>
</template>

<style scoped>
/* Global styles */
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  background-image: url("../assets/damier.png");
  background-size: 100vw auto;
  background-repeat: repeat-y;
  background-position: center top;
}

/* Formulaire de connexion */
.login {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-image: url("../assets/damier.png");
  background-size: cover;
  padding: 40px 20px;
  background-position: center;
}

.login h1 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #000;
  margin-bottom: 40px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}

/* Champs d'entrée */
form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  max-width: 600px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 700;
  color: #000;
  font-size: 18px;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border: 2px solid #234899;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Bouton */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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

/* Liens */
.link-group {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
}

.link-group a {
  color: #234899;
  text-decoration: none;
  font-weight: 700;
}

.link-group a:hover {
  text-decoration: underline;
}
</style>
