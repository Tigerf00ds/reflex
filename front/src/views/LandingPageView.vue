<script setup lang="ts"></script>

<template>
  <div class="landing-page-container">

    <img src="../assets/Etre2.png" alt="">

    <!-- Main content -->
    <div class="main-content">
      <div class="rectangle" id="rectangle1">
        <p class="rectangle-text">En salon et à domicile</p>
      </div>
      <div class="rectangle" id="rectangle2">
        <p class="rectangle-text">En entreprise</p>
      </div>
      <div class="rectangle" id="rectangle3">
        <p class="rectangle-text">Dans une structure</p>
      </div>
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
  background-image: url("../assets/damier.png") ;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.landing-page-container > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Main content */
.main-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 200px;
  padding: 20px;
  flex-grow: 1;
  z-index: 2;
}

.rectangle {
  margin-right: 16px;
  width: 309px;
  height: 229px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #000;
  background: rgba(245, 245, 245, 0.25);
}

.rectangle-text {
  font-weight: 800;
  font-size: 40px;
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
  font-size: 32px;
  font-weight: 500;
  color: #234899;
  margin: 30px 0;
  z-index: 2;
}
</style>
