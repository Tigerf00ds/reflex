<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuActive = ref(false)

function toggleMobileMenu() {
  isMobileMenuActive.value = !isMobileMenuActive.value
}

</script>

<template>
  <button @click="toggleMobileMenu" class="burger-btn" :class="{ 'active': isMobileMenuActive }">
    <img src="@/assets/Burger.svg" alt="menu burger" />
  </button>
  <nav v-if="isMobileMenuActive" class="mobile-nav" @click="toggleMobileMenu" >
    <button class="close-button" @click="toggleMobileMenu">
      <span>&times;</span>
     </button>
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
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  z-index: 999;
  padding-top: 32px;
}

.mobile-nav a {
  font-weight: 700;
  font-size: 20px;
  color: #000;
  word-break: keep-all;
  text-decoration: none;
  transition: all 0.3s ease-in;
  border-bottom: 1px solid black;
  width: 100%;
  padding: 8px 0;
  text-align: center;
}

.mobile-nav a:hover {
  color: #234899;
  border-radius: 4px;
  transition: all 0.3s ease-in;
  scale: 1.1;
}

.burger-btn {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.close-button span {
  font-size: 24px;
  color: black;
}
</style>
