<script setup lang="ts"></script>

<template>
  <div class="landing-page-container">
    <img src="../assets/imagereflex.png" alt="" class="centered-image">

    <!-- Main content -->
    <div class="main-content">
      <a href="/salon-domicile" class="rectangle" id="rectangle1">
        <p class="rectangle-text">En salon et à domicile</p>
      </a>
      <a href="/entreprise" class="rectangle" id="rectangle2">
        <p class="rectangle-text">En entreprise</p>
      </a>
      <a href="/structure" class="rectangle" id="rectangle3">
        <p class="rectangle-text">Dans une structure</p>
      </a>
    </div>

    <!-- Catchphrase -->
    <p class="catchphrase">
      Petite phrase d’accroche qui colle bien, à la situation ou un truc dans le
      genre.
    </p>
  </div>
</template>

<style scoped>
/* Global styles */
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  background-image: url("../assets/damier.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

/* Container for structuring the page */
.landing-page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.landing-page-container > .centered-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Reduce size to show background */
  height: auto;
  z-index: 1;
}

/* Main content */
.main-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 300px; /* Descend the rectangles further down */
  padding: 20px;
  flex-grow: 1;
  z-index: 2;
}

.rectangle {
  margin-right: 16px;
  width: 250px; /* Reduce size */
  height: 180px; /* Reduce size */
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #000;
  background: rgba(245, 245, 245, 0.25);
  text-decoration: none; /* Supprimer le soulignement des liens */
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.rectangle:hover {
  transform: scale(1.05); /* Effet de zoom au survol */
  background-color: rgba(35, 72, 153, 0.1); /* Changement de couleur au survol */
}

.rectangle-text {
  font-weight: 800;
  font-size: 32px; /* Adjust font size to match smaller rectangle */
  color: #000;
}

#rectangle1 {
  background-color: #eeeef4;
}

#rectangle2 {
  background-color: #fbf9ea;
}

#rectangle3 {
  background-color: #d9eafc;
}

/* Catchphrase styles */
.catchphrase {
  text-align: center;
  font-size: 28px; /* Adjust font size slightly */
  font-weight: 500;
  color: #234899;
  margin: 30px 0;
  z-index: 2;
}
</style>
