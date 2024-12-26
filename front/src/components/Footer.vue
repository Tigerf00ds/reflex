<template>
  <!-- Footer -->
  <footer class="footer">
    <nav class="footer-nav">
      <RouterLink to="Reservation">Réservation</RouterLink>
      <RouterLink to="Salon-Domicile">Salon & Domicile</RouterLink>
      <RouterLink to="Entreprise">Entreprise</RouterLink>
      <RouterLink to="Structure">Structure</RouterLink>
      <RouterLink to="Contact">Contact</RouterLink>
      <RouterLink to="#">Évènements</RouterLink>
      <RouterLink to="Présentation">Présentation</RouterLink>
      <RouterLink to="#">Mentions légales</RouterLink>
    </nav>
  </footer>
</template>

<style scoped>
/* Footer */
.footer {
  background-color: #e5e0ff; /* Violet pâle */
  padding: 20px 0;
  background-image: url('../assets/damier.png'); /* Ajout de l'image en arrière-plan */
  background-size: cover; /* L'image couvre toute la largeur */
  background-repeat: no-repeat;
  background-position: center; /* Centrer l'image */
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.footer-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px; /* Augmenter l'espace entre les éléments */
  margin: 0;
  padding: 0;
}

.footer-nav a {
  font-weight: 700;
  font-size: 18px;
  color: #000; /* Texte noir */
  text-decoration: none;
  padding: 8px 12px;
  letter-spacing: 0.5px;
}

.footer-nav a:hover {
  color: #234899;
  background-color: rgba(35, 72, 153, 0.1);
  border-radius: 4px;
}
</style>
