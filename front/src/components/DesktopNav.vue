<template>
  <nav class="nav">
    <RouterLink to="/">Landing Page</RouterLink>
    <RouterLink to="Entreprise">Entreprise</RouterLink>
    <RouterLink to="Salon-Domicile">Salon & Domicile</RouterLink>
    <RouterLink to="Structure">Structure</RouterLink> 
    <!-- <RouterLink to="prestations">Mes Prestations</RouterLink> -->
    <RouterLink to="Reservation">Réservation</RouterLink>
    <RouterLink to="presentation">Présentation</RouterLink>
    <RouterLink to="Contact">Contact</RouterLink>
    <!-- <RouterLink to="#">Évènements</RouterLink> -->
    <!-- <RouterLink to="login">Login</RouterLink> -->
  </nav>
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
