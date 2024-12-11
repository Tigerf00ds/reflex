<template>
    <div class="wrapper">
        <h2>Back-office</h2>
        <div class="card">
            <h3  @click="toggleUsers">Users</h3>
            <div ref="usersContent" 
                class="menu-content" 
                :style="{ maxHeight: usersOpen ? usersHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && users.length<1">Aucun utilisateur</p>
                </div>
                <div class="card-content" v-if="!isLoading && users.length">
                    <div class="card-entries" v-for="user in users" :key="user.id">
                        <p>{{ user.email }}</p>
                        <div class="actions"><span @click="console.log(user.id)" class="edit"></span><span @click="console.log(user.id)" class="delete">X</span></div>
                    </div>
                    <div class="card-entries" @click="console.log('add')">
                        <p>+</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <h3 @click="toggleAppointments">Rendez-vous</h3>
            <div ref="appointmentsContent" 
                class="menu-content" 
                :style="{ maxHeight: appointmentsOpen ? appointmentsHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && appointments.length<1">Aucun rendez-vous</p>
                </div>
                <div class="card-content" v-if="!isLoading && appointments.length>0">
                    <div class="entry-wrapper" v-for="(appointment, index) in appointments" :key="appointment.id">
                        <div :class="{invisible: index===editingAppointment}"  class="card-entries">
                            <div>
                                <p>Patient/e : {{ decode(appointment.name) }}</p>
                                <p>Mail : <a :href="'mailto:'+appointment.email">{{ decode(appointment.email) }}</a></p>
                                <p>Téléphone : <a :href="'tel:'+appointment.telephone">{{ decode(appointment.telephone)}}</a></p>
                                <p>Soin : {{ decode(cares.find(care => care.id === appointment.care_id)?.name || 'Horaire bloqué')  }}</p>
                                <p>Lieu : {{ decode(appointment.address) }}</p>
                                <p>Date : {{ appointment.date_booked.slice(0,10) }}</p>
                                <p>Début : {{ hourisation(appointment.time_start) }} Fin : {{ hourisation(appointment.time_end) }} ({{ durationBetween(appointment.time_start, appointment.time_end) }} minutes)</p>
                                <p v-if="appointment.time_depart!==appointment.time_start || appointment.time_return!==appointment.time_end">Départ : {{ hourisation(appointment.time_depart) }} Retour : {{ hourisation(appointment.time_return) }}</p>
                                <p>Tarif : {{ monisator(appointment.price) }}</p>
                            </div>
                            <div class="actions"><span @click="appointmentEdit(index, appointment)" class="edit">E</span><span @click="console.log(appointment.id)" class="delete">X</span></div>
                        </div>
                        <form :class="{invisible: index!==editingAppointment}" class="card-entries">
                            <div>
                                <label :for="'name'+appointment.id">
                                    Patient/e : 
                                    <input v-model="editedAppointment.name" type="text" :name="'name'+appointment.id" :id="'name'+appointment.id">
                                </label>
                                <label :for="'email'+appointment.id">
                                    Mail : 
                                    <input v-model="editedAppointment.email" type="email" :name="'email'+appointment.id" :id="'email'+appointment.id">
                                </label>
                                <label :for="'telephone'+appointment.id">
                                    Téléphone : 
                                    <input v-model="editedAppointment.telephone" type="tel" :name="'telephone'+appointment.id" :id="'telephone'+appointment.id">
                                </label>
                                <label :for="'care'+appointment.id">
                                    Soin : 
                                    <select v-model="editedAppointment.care_id" :name="'care'+appointment.id" :id="'care'+appointment.id">
                                        <option value="0">Bloquage d'horaire</option>
                                        <option v-for="care in cares" :value="care.id" :key="care.id">{{ care.name }}</option>
                                    </select>
                                </label>
                                <label :for="'address'+appointment.id">
                                    Lieu : 
                                    <input v-model="editedAppointment.address" type="text" :name="'address'+appointment.id" :id="'address'+appointment.id"> <button @click.prevent="editedAppointment.address='salon'">Au salon</button>
                                </label>
                                <label :for="'year'+appointment.id">
                                    Date : 
                                    <select v-model="editedAppointment.year_booked" :name="'year'+appointment.id" :id="'year'+appointment.id">
                                        <option v-for="index in 50" :value="(new Date().getFullYear()-1+index).toString()" :key="'year'+index">{{ new Date().getFullYear()-1+index }}</option>
                                    </select>
                                    <select v-model="editedAppointment.month_booked" :name="'month'+appointment.id" :id="'month'+appointment.id">
                                        <option v-for="index in 12" :value="index.toString().length<2?'0'+index.toString():index.toString()" :key="'month'+index">{{ index.toString().length<2?'0':'' }}{{ index.toString() }}</option>
                                    </select>
                                    <select v-model="editedAppointment.day_booked" :name="'day'+appointment.id" :id="'day'+appointment.id">
                                        <option v-for="index in 31" :value="index.toString().length<2?'0'+index.toString():index.toString()" :key="'day'+index">{{ index.toString().length<2?'0':'' }}{{ index.toString() }}</option>
                                    </select>
                                </label>
                                <label  :for="'time_start'+appointment.id">
                                    Début : 
                                    <input v-model="editedAppointment.time_start" type="number" step="5" :name="'time_start'+appointment.id" :id="'time_start'+appointment.id">
                                     Durée : 
                                     <input v-model="editedAppointment.duration" type="number" step="5" :name="'duration'+appointment.id" :id="'duration'+appointment.id">
                                      minutes</label>
                                <label v-if="appointment.time_depart!==appointment.time_start || appointment.time_return!==appointment.time_end">
                                    Départ : {{ hourisation(appointment.time_depart) }} Retour : {{ hourisation(appointment.time_return) }}
                                </label>
                                <label  :for="'name'+appointment.id">
                                    Tarif : {{ monisator(appointment.price) }}
                                </label>
                            </div>
                            <!-- TODO Envoi en BDD -->
                            <div class="actions"><span @click="console.log(editedAppointment)" class="edit">O</span><span @click="editingAppointment=null" class="delete">X</span></div>
                        </form>
                    </div>
                    <div class="card-entries" @click="console.log('add')">
                        <p>+</p>
                    </div>
            </div>
            </div>
        </div>
        <div class="card">
            <h3 @click="toggleCares">Soins</h3>
            <div ref="caresContent" 
                class="menu-content" 
                :style="{ maxHeight: caresOpen ? caresHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && cares.length<1">Aucun soin</p>
                </div>
                <div class="card-content" v-if="!isLoading && cares.length">
                    <div class="card-entries" v-for="care in cares" :key="care.id">
                        <p>{{ care }}</p>
                        <p>{{ decode(care.name) }}</p>
                        <p>{{ decode(care.short_description) }}</p>
                    <p>{{ care.price }}</p>
                    <div class="actions"><span @click="console.log(care.id)" class="edit">E</span><span @click="console.log(care.id)" class="delete">X</span></div>
                </div>
                <div class="card-entries" @click="console.log('add')">
                    <p>+</p>
                </div>
            </div>
        </div>
        </div>
        <div class="card">
            <h3 @click="toggleEvents">Évenements</h3>
            <div ref="eventsContent" 
                class="menu-content" 
                :style="{ maxHeight: eventsOpen ? eventsHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && events.length<1">Aucun évenement</p>
                </div>
                <div class="card-content" v-if="!isLoading && events.length">
                    <div class="card-entries" v-for="event in events" :key="event.id">
                        <p>{{ event }}</p>
                        <div class="actions"><span @click="console.log(event.id)" class="edit">E</span><span @click="console.log(event.id)" class="delete">X</span></div>
                    </div>
                    <div class="card-entries" @click="console.log('add')">
                        <p>+</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <h3  @click="toggleGuestbook">Livre d'or</h3>
            <div ref="guestbookContent" 
                class="menu-content" 
                :style="{ maxHeight: guestbookOpen ? guestbookHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && guestbook.length<1">Aucune signature</p>
            </div>
            <div class="card-content" v-if="!isLoading && guestbook.length">
                <div class="card-entries" v-for="guest in guestbook" :key="guest.id">
                    <p>{{ guest }}</p>
                    <div class="actions"><span @click="console.log(guest.id)" class="delete">X</span></div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { decode } from 'he';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import hourisation from '@/modules/hourisation';
import durationBetween from '@/modules/durationBetween';
import monisator from '@/modules/monisation';

const token = ref<string>(localStorage.getItem('token')||'');
const users = ref();
const appointments = ref();
const cares = ref();
const events = ref();
const guestbook = ref();
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');
const editingAppointment = ref<number>();
const editedAppointment = ref({
    id: 0,
    care_id: 0,
    address: '',
    name: '',
    email: '',
    telephone: '',
    date_booked: '',
    time_start: 0,
    year_booked: '',
    month_booked: '',
    day_booked: '',
    duration: 0
});
const usersContent = ref(null);
const appointmentsContent = ref(null);
const caresContent = ref(null);
const eventsContent = ref(null);
const guestbookContent = ref(null);
const usersOpen = ref(false);
const appointmentsOpen = ref(false);
const caresOpen = ref(false);
const eventsOpen = ref(false);
const guestbookOpen = ref(false);
const usersHeight = ref("0px");
const appointmentsHeight = ref("0px");
const caresHeight = ref("0px");
const eventsHeight = ref("0px");
const guestbookHeight = ref("0px");
let resizeObserver;

const toggleUsers = async () => {
    usersOpen.value = !usersOpen.value;
    await nextTick();
    usersHeight.value = usersOpen.value 
    ? usersContent.value.scrollHeight + "px"
    : "0px";
};

const toggleAppointments = async () => {
    appointmentsOpen.value = !appointmentsOpen.value;
    await nextTick();
    appointmentsHeight.value = appointmentsOpen.value 
    ? appointmentsContent.value.scrollHeight + "px"
    : "0px";
};

const toggleCares = async () => {
    caresOpen.value = !caresOpen.value;
    await nextTick();
    caresHeight.value = caresOpen.value 
    ? caresContent.value.scrollHeight + "px"
    : "0px";
};

const toggleEvents = async () => {
    eventsOpen.value = !eventsOpen.value;
    await nextTick();
    eventsHeight.value = eventsOpen.value 
    ? eventsContent.value.scrollHeight + "px"
    : "0px";
};

const toggleGuestbook = async () => {
    guestbookOpen.value = !guestbookOpen.value;
    await nextTick();
    guestbookHeight.value = guestbookOpen.value 
    ? guestbookContent.value.scrollHeight + "px"
    : "0px";
};

const appointmentEdit = (index, appointment) => {
    editingAppointment.value = index;
    editedAppointment.value = appointment;
    editedAppointment.value.date_booked = appointment.date_booked.slice(0,10);
    editedAppointment.value.year_booked = appointment.date_booked.split('-')[0];
    editedAppointment.value.month_booked = appointment.date_booked.split('-')[1];
    editedAppointment.value.day_booked = appointment.date_booked.split('-')[2];
    editedAppointment.value.duration = durationBetween(appointment.time_start, appointment.time_end);
}

onMounted(async () => {
    resizeObserver = new ResizeObserver(() => {
    if (usersOpen.value) {
        usersHeight.value = usersContent.value.scrollHeight + "px";
    }
    if (appointmentsOpen.value) {
        appointmentsHeight.value = appointmentsContent.value.scrollHeight + "px";
    }
    if (caresOpen.value) {
        caresHeight.value = caresContent.value.scrollHeight + "px";
    }
    if (eventsOpen.value) {
        eventsHeight.value = eventsContent.value.scrollHeight + "px";
    }
    if (guestbookOpen.value) {
        guestbookHeight.value = guestbookContent.value.scrollHeight + "px";
    }
    });
    try {
        await nextTick();
        if (usersContent.value) resizeObserver.observe(usersContent.value);
        if (appointmentsContent.value) resizeObserver.observe(appointmentsContent.value);

        const tokenHeader = { Authorization: `bearer ${token.value}` };
        const responses = await Promise.all([
            fetch('http://localhost:3000/api/users/', {
                headers: { 'Content-Type': 'application/json', ...tokenHeader },
            }),
            fetch('http://localhost:3000/api/appointments/', {
                headers: { 'Content-Type': 'application/json' },
            }),
            fetch('http://localhost:3000/api/cares/', {
                headers: { 'Content-Type': 'application/json' },
            }),
            fetch('http://localhost:3000/api/events/', {
                headers: { 'Content-Type': 'application/json' },
            }),
            fetch('http://localhost:3000/api/guestbook/', {
                headers: { 'Content-Type': 'application/json' },
            }),
        ]);

        const jsonResponses = await Promise.all(responses.map(res => {
            if (!res.ok) throw new Error(`Error: ${res.statusText}`);
            return res.json();
        }));

        [users.value, appointments.value, cares.value, events.value, guestbook.value] = jsonResponses;
    } catch (err) {
        console.error(err);
        loadingError.value = 'Erreur de connexion au serveur';
    } finally {
        isLoading.value = false;
    }
})

onBeforeUnmount(() => {
  resizeObserver.unobserve(usersContent.value);
  resizeObserver.unobserve(appointmentsContent.value);
  resizeObserver.unobserve(caresContent.value);
  resizeObserver.unobserve(eventsContent.value);
  resizeObserver.unobserve(guestbookContent.value);
  resizeObserver.disconnect();
});
</script>

<style scoped>
.wrapper {
    margin: 2rem auto;
    min-height: 100vh;
    width: 100%;
    gap: 1rem;
}

p, h3 {
    margin: 0;
}

.wrapper, .card, .card-content, .card-entries {
    display: flex;
    flex-direction: column;
}

.card {
    gap: 1rem;
}

.card-content {
    gap: 0.75rem;
}

.card-entries {
    padding: 0.25rem 0.5rem;
    background-color: #daccea;
    border-radius: 5px;
}

.entry-wrapper:nth-of-type(even)>.card-entries {
    background-color: #eaccda;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.edit {
    color: #33aa33;
    cursor: pointer;
}

.delete {
    color: #aa3333;
    cursor: pointer;
}

h3 {
    text-align: center;
    color: #fbf9ea;
    /* background-color: #B398C9; */
    background-color: #234899;
    border-radius: 5px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.invisible {
    display: none;
}

.menu-content {
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

@media only screen and (min-width: 770px) {
  .card-entries {
      padding: 1rem 3rem;
}
.card-entries>div:first-of-type {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>