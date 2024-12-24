<template>
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <a href="/">
        <img src="../assets/Etre2.png" alt="Logo" class="logo" />
      </a>
      <nav class="nav">
        <a href="/">Landing Page</a>
        <a href="Entreprise">Entreprise</a>
        <a href="Salon-Domicile">Salon & Domicile</a>
        <a href="Structure">Structure</a> 
        <!-- <a href="prestations">Mes Prestations</a> -->
        <a href="Reservation">Réservation</a>
        <a href="presentation">Présentation</a>
        <a href="Contact">Contact</a>
        <!-- <a href="#">Évènements</a> -->
        <!-- <a href="login">Login</a> -->
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Header */
.header {
  display: flex;
  justify-content: space-between; /* Logo à gauche et navigation à droite */
  align-items: center;
  padding: 20px;
  background-image: url('../assets/damier.png'); /* Ajout de l'image en arrière-plan */
  background-size: cover; /* L'image couvre toute la largeur */
  background-repeat: no-repeat;
  background-position: center; /* Centrer l'image */
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  z-index: 999;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header .logo {
  height: 80px;
}

.nav {
  display: flex;
  gap: 30px;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
}

.nav a {
  margin: 0 15px;
  font-weight: 700;
  font-size: 20px;
  color: #000;
  word-break: keep-all;
  text-decoration: none;
  transition: all 0.3s ease-in;
}

.nav a:hover {
  color: #234899;
  border-radius: 4px;
  transition: all 0.3s ease-in;
  scale: 1.1;
}
</style>
