<script setup lang="ts">
import { reactive, ref } from 'vue';
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const width = window.innerWidth

type ReservationForm = {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  type: string;
  location: string;
  address: string;
  zipCode: string;
  date: string;
};

const form = reactive<ReservationForm>({
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  type: "",
  location: "",
  address: "",
  zipCode: "",
  date: ""
});

async function submit(e: Event) {
  e.preventDefault();

  await fetch("http://localhost:3000/api/reservation", {
    method: "post",
    body: JSON.stringify(form),
    headers: { "Content-type": "application/json" },
  })
    .then(async (responseHTTP) => {
      if(responseHTTP.status === 500) {
        const errorMessage = await responseHTTP.text()
        return toast.error(errorMessage);
      }

      responseHTTP.text().then(responseValue => {
        toast.success(responseValue);
        form.nom = ''
        form.prenom = ''
        form.email = ''
        form.address = ''
        form.location = ''
        form.phone = ''
        form.date = ''
        form.type = ''
        form.zipCode = ''
      })

    })
}

const cares: any = ref([])

const getData = () => {
  fetch('http://localhost:3000/api/cares')
    .then(res => res.json())
    .then((response) => {      
      cares.value = response // <---- assign to the ref's value
      console.log(cares.value);
    })
    .catch((error) => {
      console.log(error)
    });
}

getData()

</script>

<template>
    <!-- Formulaire de réservation -->
    <div class="reservation-form">
      <h1>Réservation</h1>
      <form @submit="submit">
        <div class="form-grid">
          <div class="input-container">
            <label for="nom">Nom</label>
            <input v-model="form.nom" id="nom" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="prenom">Prénom</label>
            <input v-model="form.prenom" id="prenom" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="email">Adresse mail</label>
            <input v-model="form.email" id="email" type="email" class="input-field" />
          </div>
          <div class="input-container">
            <label for="phone">Numéro de téléphone</label>
            <input v-model="form.phone" id="phone" type="tel" class="input-field" />
          </div>
          <div class="input-container">
            <label for="type">Type de soin</label>
            <select v-model="form.type" id="type" class="input-field">
              <option>Choisissez une option</option>
              <option        
                v-for="care in cares"
                :key="care.id"
              >
                {{care.name}}
              </option>
            </select>
          </div>
          <div class="input-container">
            <label for="lieu">Lieu de la prestation</label>
            <select v-model="form.location" id="lieu" class="input-field">
              <option>Choisissez une option</option>
              <option>Salon & Domicile</option>
              <option>Entreprise</option>
              <option>Structure</option>
            </select>
          </div>
          <div class="input-container">
            <label for="address">Adresse</label>
            <input v-model="form.address" id="address" type="text" class="input-field" />
          </div>
          <div class="input-container">
            <label for="postal">Code postal</label>
            <input v-model="form.zipCode" id="postal" type="text" class="input-field" />
          </div>

          <!-- Conteneur pour le champ Date et bouton -->
          <div class="input-container">
            <label for="date">Date du rendez-vous</label>
            <input v-model="form.date" id="date" type="date" class="input-field" />
          </div>
          
          <div v-if="width > 900" class="input-container submit-container">
            <button type="submit" class="submit-button">Réserver</button>
          </div>
        </div>
        <div v-if="width <= 900" class="submit-btn-wrapper">
          <button type="submit" class="submit-button">Réserver</button>
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

.submit-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 16px;
}

.submit-container .submit-button {
  width: min-content;
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


@media (max-width: 900px) {
  .form-grid {
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  
.reservation-form form .submit-btn-wrapper {
  display: flex;
  justify-content:center;
  width: 100%;
  margin-bottom: 16px;
}
}
</style>
