<template>
    <div class="wrapper">
        <h2>Test de back-office</h2>
        <div class="card">
            <h3>Users</h3>
            <div class="loading">
                <LoadingSpinner v-if="isLoading"/>
                <p v-if="!isLoading && users.length<1">Aucun utilisateur</p>
            </div>
            <div class="cardContent" v-if="!isLoading && users.length">
                <div class="cardEntries" v-for="user in users" :key="user.id">
                    <p>{{ user.email }}</p>
                    <div class="actions"><span @click="console.log(user.id)" class="edit">E</span><span @click="console.log(user.id)" class="delete">X</span></div>
                </div>
                <div class="cardEntries" @click="console.log('add')">
                    <p>+</p>
                </div>
            </div>
        </div>
        <div class="card">
            <h3>Rendez-vous</h3>
            <div class="loading">
                <LoadingSpinner v-if="isLoading"/>
                <p v-if="!isLoading && appointments.length<1">Aucun rendez-vous</p>
            </div>
            <div class="cardContent" v-if="!isLoading && appointments.length>0">
                <div class="cardEntries" v-for="appointment in appointments" :key="appointment.id">
                    <p>Séance avec {{ decode(appointment.name) }}</p>
                    <p>de {{ decode(cares.find(care => care.id === appointment.care_id)?.name || 'Unknown Care')  }}</p>
                    <p>à {{ decode(appointment.address) }}</p>
                    <p>le {{ appointment.date_booked.slice(0,10) }}</p>
                    <p>de {{ hourisation(appointment.time_start) }} à {{ hourisation(appointment.time_end) }}</p>
                    <p v-if="appointment.time_depart!==appointment.time_start || appointment.time_return!==appointment.time_end">partir à {{ hourisation(appointment.time_depart) }}, vous serez revenu à {{ hourisation(appointment.time_return) }}</p>
                    <p>à {{ appointment.price }}</p>
                    <div class="actions"><span @click="console.log(appointment.id)" class="edit">E</span><span @click="console.log(appointment.id)" class="delete">X</span></div>
                </div>
                <div class="cardEntries" @click="console.log('add')">
                    <p>+</p>
                </div>
            </div>
        </div>
        <div class="card">
            <h3>Cares</h3>
            <div class="loading">
                <LoadingSpinner v-if="isLoading"/>
                <p v-if="!isLoading && cares.length<1">Aucun soin</p>
            </div>
            <div class="cardContent" v-if="!isLoading && cares.length">
                <div class="cardEntries" v-for="care in cares" :key="care.id">
                    <p>{{ care }}</p>
                    <p>{{ decode(care.name) }}</p>
                    <p>{{ decode(care.short_description) }}</p>
                    <p>{{ care.price }}</p>
                    <div class="actions"><span @click="console.log(care.id)" class="edit">E</span><span @click="console.log(care.id)" class="delete">X</span></div>
                </div>
                <div class="cardEntries" @click="console.log('add')">
                    <p>+</p>
                </div>
            </div>
        </div>
        <div class="card">
            <h3>Events</h3>
            <div class="loading">
                <LoadingSpinner v-if="isLoading"/>
                <p v-if="!isLoading && events.length<1">Aucun évenement</p>
            </div>
            <div class="cardContent" v-if="!isLoading && events.length">
                <div class="cardEntries" v-for="event in events" :key="event.id">
                    <p>{{ event }}</p>
                    <div class="actions"><span @click="console.log(event.id)" class="edit">E</span><span @click="console.log(event.id)" class="delete">X</span></div>
                </div>
                <div class="cardEntries" @click="console.log('add')">
                    <p>+</p>
                </div>
            </div>
        </div>
        <div class="card">
            <h3>Guestbook</h3>
            <div class="loading">
                <LoadingSpinner v-if="isLoading"/>
                <p v-if="!isLoading && guestbook.length<1">Aucune signature</p>
            </div>
            <div class="cardContent" v-if="!isLoading && guestbook.length">
                <div class="cardEntries" v-for="guest in guestbook" :key="guest.id">
                    <p>{{ guest }}</p>
                    <div class="actions"><span @click="console.log(guest.id)" class="delete">X</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { decode } from 'he';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import hourisation from '@/modules/hourisation';

const token = ref<string>(localStorage.getItem('token')||'');
const users = ref();
const appointments = ref();
const cares = ref();
const events = ref();
const guestbook = ref();
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');

onMounted(async () => {
    try{
        const resUsers = await fetch('http://localhost:3000/api/users/',{
              headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`}
            });
        if(!resUsers.ok){
            const err = await resUsers.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            users.value = await resUsers.json();
        }
        const resAppointments = await fetch('http://localhost:3000/api/appointments/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resAppointments.ok){
            const err = await resAppointments.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            appointments.value = await resAppointments.json();
        }
        const resCares = await fetch('http://localhost:3000/api/cares/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resCares.ok){
            const err = await resCares.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            cares.value = await resCares.json();
        }
        const resEvents = await fetch('http://localhost:3000/api/events/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resEvents.ok){
            const err = await resEvents.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            events.value = await resEvents.json();
        }
        const resGuestbook = await fetch('http://localhost:3000/api/guestbook/',{
            headers: {'Content-Type': 'application/json'}
        });
        if(!resGuestbook.ok){
            const err = await resGuestbook.json();
            loadingError.value = err.details;
            isLoading.value = false;
            return;
        } else {
            guestbook.value = await resGuestbook.json();
        }
    } catch(err) {
        console.error(err);
        loadingError.value = 'Erreur de connexion au serveur';
        isLoading.value = false;
        return;
    }
    isLoading.value = false;
})
</script>

<style scoped>
.wrapper {
    margin: 2rem auto;
    width: 100%;
    gap: 1rem;
}

.wrapper, .card, .cardContent,.cardEntries {
    display: flex;
    flex-direction: column;
}

.card {
    gap: 0.75rem;
}

.cardContent {
    gap: 0.5rem;
}

.cardEntries {
    display: flex;
    flex-wrap: wrap;
    padding: 0.25rem 0.5rem;
    background-color: #daccea;
    border-radius: 5px;
}

.cardEntries:nth-of-type(even) {
    background-color: #eaccda;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.edit {
    color: #33aa33;
}

.delete {
    color: #aa3333;
}

h3 {
    text-align: center;
    color: #FFF;
    /* background-color: #B398C9; */
    background-color: #234899;
    border-radius: 5px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>