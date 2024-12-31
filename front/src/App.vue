<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Header/>
  
  <div class="container">
    <div class="content">
      <RouterView />
    </div>
  </div>

  <Footer/>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-image: url("assets/bambino.png"), url("assets/bambino.png");
  background-repeat: no-repeat;
  background-position: left center, right center;
  background-size: 20% 100%;
  padding-top: 127px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 20%;
  background-image: url("/src/assets/damier.png");
  background-size: cover;
  background-repeat: repeat;
  background-position: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (max-width: 900px) {
  .container {
    min-height: 100px !important;
  }

  .content {
    margin: 0;
  }
}
</style>
