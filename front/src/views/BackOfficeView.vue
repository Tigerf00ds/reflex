<template>
    <InfoModal 
        :isOpen="modalOpen"
        :title="modalTitle"
        :text="modalText"
        @emitModal="modalOpen=false"/>
    <div class="wrapper">
        <h2 @click="modalOpen=true">Back-office</h2>
        <div class="card">
            <h3  @click="toggleUsers">Comptes administrateurs</h3>
            <div ref="usersContent" 
                class="menu-content" 
                :style="{ maxHeight: usersOpen ? usersHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && users.length<1">Aucun utilisateur</p>
                </div>
                <div class="card-content" v-if="!isLoading && users.length">
                    <div class="entry-wrapper" v-for="(user, index) in users" :key="user.id">
                        <div :class="{invisible: index===editingUser}" class="card-entries">
                            <div>
                                <p>{{ user.email }}</p>
                            </div>
                            <div class="actions"><span @click="userEdit(index, user)" class="edit">E</span><span v-if="!user.id===1" @click="console.log(user.id)" class="delete">X</span></div>
                        </div>
                        <form :class="{invisible: index!==editingUser}" class="card-entries">
                            <div>
                                <div>
                                    <p>
                                        <label :for="'User-email'+user.id">
                                            E-mail : 
                                            <input v-model="editedUser.email" type="email" :name="'User-email'+user.id" :id="'User-email'+user.id">
                                            <span style="color: #aa3333" v-if="!editedUser.email">Requis</span>
                                            <span style="color: #aa3333" v-if="editedUser.email && !editedUser.email.match(emailRegex)">Invalide</span>
                                        </label>
                                    </p>
                                </div>
                                <div>
                                    <p>Le mot de passe doit contenir :</p>
                                    <p><span style="color: #aa3333" v-if="!editedUser.password.match(/.{10,255}/)">X</span><span style="color: #33aa33" v-else>O</span> 10 caractères</p>
                                    <p><span style="color: #aa3333" v-if="!editedUser.password.match(/[a-z]/)">X</span><span style="color: #33aa33" v-else>O</span> 1 minuscule</p>
                                    <p><span style="color: #aa3333" v-if="!editedUser.password.match(/[A-Z]/)">X</span><span style="color: #33aa33" v-else>O</span> 1 majuscule</p>
                                    <p><span style="color: #aa3333" v-if="!editedUser.password.match(/[0-9]/)">X</span><span style="color: #33aa33" v-else>O</span> 1 chiffre</p>
                                    <p><span style="color: #aa3333" v-if="!editedUser.password.match(/[!@#$%^&*(),;.?:{}|<>]/)">X</span><span style="color: #33aa33" v-else>O</span> 1 caractère spécial parmis !@#$%^&*(),;.?":{}|<></p>
                                </div>
                                <div>
                                    <p>
                                        <label :for="'password'+user.id">
                                            Mot de passe : 
                                            <input v-model="editedUser.password" type="password" :name="'password'+user.id" :id="'password'+user.id">
                                            <span style="color: #aa3333" v-if="!editedUser.password">Requis</span>
                                        </label>
                                    </p>
                                    <p>
                                        <label :for="'password_confirm'+user.id">
                                            Confirmation : 
                                            <input v-model="editedUser.password_confirm" type="password" :name="'password_confirm'+user.id" :id="'password_confirm'+user.id">
                                            <span style="color: #aa3333" v-if="!editedUser.password_confirm">Requis</span>
                                            <span style="color: #aa3333" v-if="editedUser.password_confirm && editedUser.password_confirm !== editedUser.password">Doit être identique au mot de passe.</span>
                                        </label>
                                    </p>
                                </div>
                            </div>
                            <div class="actions">
                                <span v-if="
                                    !editedUser.email ||
                                    !editedUser.email.match(emailRegex) ||
                                    !editedUser.password.match(/.{10,255}/) ||
                                    !editedUser.password.match(/[a-z]/) ||
                                    !editedUser.password.match(/[A-Z]/) ||
                                    !editedUser.password.match(/[0-9]/) ||
                                    !editedUser.password.match(/[!@#$%^&*(),;.?:{}|<>]/) ||
                                    !editedUser.password_confirm ||
                                    editedUser.password_confirm !== editedUser.password
                                ">
                                    O
                                </span>
                                <span v-else @click="updateUser" class="edit">O</span>
                                <span @click="editingUser=null" class="delete">X</span>
                            </div>
                        </form>
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
                                <div>
                                    <div>
                                        <p>Date : {{ appointment.date_booked.slice(0,10) }}</p>
                                        <br>
                                    </div>
                                    <div>
                                        <p>{{ hourisation(appointment.time_start) }} - {{ hourisation(appointment.time_end) }}</p>
                                        <p v-if="appointment.time_depart!==appointment.time_start || appointment.time_return!==appointment.time_end">Départ : {{ hourisation(appointment.time_depart) }} Retour : {{ hourisation(appointment.time_return) }}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>Patient/e : {{ decode(appointment.name) }}</p>
                                    <p>E-mail : <a :href="'mailto:'+decode(appointment.email)">{{ decode(appointment.email) }}</a></p>
                                    <p>Téléphone : <a :href="'tel:'+decode(appointment.telephone)">{{ decode(appointment.telephone)}}</a> <span>{{ banned_users.find(user => user.telephone === appointment.telephone)?"Numéro banni":"" }}</span></p>
                                </div>
                                <div>
                                    <p>Soin : {{ decode(cares.find(care => care.id === appointment.care_id)?.name || 'Horaire bloquée')  }}</p>
                                    <p>Lieu : {{ decode(appointment.address) }}</p>
                                    <p>Durée : {{ durationBetween(appointment.time_start, appointment.time_end) }} minutes</p>
                                    <p v-if="appointment.time_start===0">Tarif : {{ monisation(cares.find(care => care.id === appointment.care_id)?.day_price || 0) }}</p>
                                    <p v-else>Tarif : {{ monisation(Math.floor(((cares.find(care => care.id === appointment.care_id)?.price || 0)/60*durationBetween(appointment.time_start, appointment.time_end))+(appointment.address==='salon'?0:(cares.find(care => care.id === appointment.care_id)?.travel_expenses || 0)))) }}</p>
                                </div>
                            </div>
                            <div class="actions"><span @click="appointmentEdit(index, appointment)" class="edit">E</span><span @click="console.log(appointment.id)" class="delete">X</span></div>
                        </div>
                        <form :class="{invisible: index!==editingAppointment}" class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>
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
                                                <span style="color: #aa3333" v-if="parseInt(editedAppointment.year_booked)<new Date().getFullYear()">
                                                    Invalide
                                                </span>
                                                <span style="color: #aa3333" v-if="new Date().getFullYear()>parseInt(editedAppointment.year_booked)">
                                                    Invalide
                                                </span>
                                                <span style="color: #aa3333" v-if="new Date().getFullYear()===parseInt(editedAppointment.year_booked) && new Date().getMonth()+1>parseInt(editedAppointment.month_booked)">
                                                    Invalide
                                                </span>
                                                <span style="color: #aa3333" v-if="new Date().getFullYear()===parseInt(editedAppointment.year_booked) && new Date().getMonth()+1===parseInt(editedAppointment.month_booked) && new Date().getDate()>=parseInt(editedAppointment.day_booked)">
                                                    Invalide
                                                </span>
                                            </label>
                                        </p>
                                        <span
                                            class="button"
                                            @click.prevent="{editedAppointment.time_start=0;editedAppointment.duration=24*60;}"
                                            v-if="
                                                // logique pour empêcher une date avant un moisà garder pour le côté user
                                                //
                                                // (new Date().getFullYear()<parseInt(editedAppointment.year_booked) ||
                                                // (new Date().getFullYear()===parseInt(editedAppointment.year_booked) &&
                                                // new Date().getMonth()+2<parseInt(editedAppointment.month_booked)) ||
                                                // (new Date().getFullYear()===parseInt(editedAppointment.year_booked) &&
                                                // new Date().getMonth()+2===parseInt(editedAppointment.month_booked) &&
                                                // new Date().getDate()<parseInt(editedAppointment.day_booked))) &&
                                                cares.find(care => care.id === editedAppointment.care_id)?.is_home ||
                                                cares.find(care => care.id === editedAppointment.care_id)?.is_structure ||
                                                cares.find(care => care.id === editedAppointment.care_id)?.is_company ||
                                                editedAppointment.care_id == 0">
                                                Toute la journée
                                            </span>
                                    </div>
                                    <div>
                                        <p>
                                            <label  :for="'time_start'+appointment.id">
                                                Début : 
                                                <select v-model="editedAppointment.time_start" :name="'time_start'+appointment.id" :id="'time_start'+appointment.id">
                                                    <option
                                                        v-for="index in 24*12+1"
                                                        :value="(Math.floor((index-1)*5/60)*100)+(Math.floor((index-1)*5%60))"
                                                        :key="'time_start'+index"
                                                        >
                                                        {{ hourisation((Math.floor((index-1)*5/60)*100)+(Math.floor((index-1)*5%60))) }}
                                                    </option>
                                                </select>
                                                Durée : 
                                                <input
                                                    v-model="editedAppointment.duration"
                                                    type="number"
                                                    :min="cares.find(care => care.id === editedAppointment.care_id)?.min_duration"
                                                    :max="cares.find(care => care.id === editedAppointment.care_id)?.max_duration"
                                                    step="5"
                                                    :name="'duration'+appointment.id" :id="'duration'+appointment.id"
                                                    >
                                            </label>
                                        </p>
                                        <p>
                                            <span
                                                style="color: #aa3333"
                                                v-if="
                                                    editedAppointment.address==='salon' &&
                                                    appointments.some(
                                                        appointment => 
                                                            appointment.id !== editedAppointment.id &&
                                                            appointment.date_booked.split('-')[0] === editedAppointment.year_booked &&
                                                            appointment.date_booked.split('-')[1] === editedAppointment.month_booked &&
                                                            appointment.date_booked.slice(0,10).split('-')[2] === editedAppointment.day_booked &&
                                                            appointment.time_return > editedAppointment.time_start &&
                                                            appointment.time_depart < addMinutes(editedAppointment.time_start, editedAppointment.duration)
                                                    )
                                                "
                                                >
                                                Horaire déjà prise
                                            </span>
                                            <span
                                                style="color: #aa3333"
                                                v-if="
                                                    editedAppointment.address!=='salon' &&
                                                    appointments.some(
                                                        appointment => 
                                                            appointment.id !== editedAppointment.id &&
                                                            appointment.date_booked.split('-')[0] === editedAppointment.year_booked &&
                                                            appointment.date_booked.split('-')[1] === editedAppointment.month_booked &&
                                                            appointment.date_booked.slice(0,10).split('-')[2] === editedAppointment.day_booked &&
                                                            appointment.time_return > addMinutes(editedAppointment.time_start-100,30) &&
                                                            appointment.time_depart < addMinutes(editedAppointment.time_start, editedAppointment.duration+30)
                                                    )
                                                "
                                                >
                                                Horaire déjà prise
                                            </span>
                                            <span v-if="editedAppointment.address!=='salon' && editedAppointment.time_start!==0">
                                                Départ : {{ hourisation(addMinutes((editedAppointment.time_start-100),30)) }} Retour : {{ hourisation(addMinutes(addMinutes(editedAppointment.time_start,editedAppointment.duration),30)) }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p>
                                        <label :for="'name'+appointment.id">
                                            Patient/e : 
                                            <input v-model="editedAppointment.name" type="text" :name="'name'+appointment.id" :id="'name'+appointment.id">
                                            <span style="color: #aa3333" v-if="!editedAppointment.name">Requis</span>
                                            <span style="color: #aa3333" v-if="editedAppointment.name && !editedAppointment.name.match(wordRegex)">Invalide</span>
                                        </label>
                                    </p>
                                    <p>
                                        <label :for="'email'+appointment.id">
                                            E-mail : 
                                            <input v-model="editedAppointment.email" type="email" :name="'email'+appointment.id" :id="'email'+appointment.id">
                                            <span style="color: #aa3333" v-if="!editedAppointment.email">Requis</span>
                                            <span style="color: #aa3333" v-if="editedAppointment.email && !editedAppointment.email.match(emailRegex)">Invalide</span>
                                        </label>
                                    </p>
                                    <p>
                                        <label :for="'telephone'+appointment.id">
                                            Téléphone : 
                                            <input v-model="editedAppointment.telephone" type="tel" :name="'telephone'+appointment.id" :id="'telephone'+appointment.id">
                                            <span style="color: #aa3333" v-if="!editedAppointment.telephone">Requis</span>
                                            <span style="color: #aa3333" v-if="editedAppointment.telephone && !editedAppointment.telephone.match(telRegex)">Invalide</span>
                                            <span v-if="banned_users.find(user => user.telephone === editedAppointment.telephone)">Numéro banni</span>
                                        </label>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <label :for="'care'+appointment.id">
                                            Soin : 
                                            <select
                                                v-model="editedAppointment.care_id"
                                                @change="{
                                                    if(editedAppointment.duration>cares.find(care => care.id === editedAppointment.care_id)?.max_duration)editedAppointment.duration=cares.find(care => care.id === editedAppointment.care_id)?.max_duration;
                                                    if(editedAppointment.duration<cares.find(care => care.id === editedAppointment.care_id)?.min_duration)editedAppointment.duration=cares.find(care => care.id === editedAppointment.care_id)?.min_duration;
                                                    }"
                                                :name="'care'+appointment.id"
                                                :id="'care'+appointment.id">
                                                <option value="0">Blocage d'horaire</option>
                                                <option v-for="care in cares" :value="care.id" :key="care.id">{{ decode(care.name) }}</option>
                                            </select>
                                        </label>
                                    </p>
                                    <p>
                                        <label :for="'address'+appointment.id">
                                            Lieu : 
                                            <input v-model="editedAppointment.address" type="text" :name="'address'+appointment.id" :id="'address'+appointment.id"> <span v-if="cares.find(care => care.id === editedAppointment.care_id)?.is_salon" class="button" @click.prevent="editedAppointment.address='salon'">Au salon</span>
                                        </label>
                                        <span style="color: #aa3333" v-if="!editedAppointment.address">Requis</span>
                                        <span style="color: #aa3333" v-if="editedAppointment.address && !editedAppointment.address.match(addressRegex)">Invalide</span>
                                    </p>
                                    <p v-if="editedAppointment.time_start===0">Tarif : {{ monisation(cares.find(care => care.id === editedAppointment.care_id)?.day_price || 0) }}</p>
                                    <p v-else>Tarif : {{ monisation(Math.floor(((cares.find(care => care.id === editedAppointment.care_id)?.price || 0)/60*editedAppointment.duration)+(editedAppointment.address==='salon'?0:(cares.find(care => care.id === editedAppointment.care_id)?.travel_expenses || 0)))) }}</p>
                                </div>
                            </div>
                            <div class="actions">
                                <span v-if="
                                        parseInt(editedAppointment.year_booked)<new Date().getFullYear() ||
                                        new Date().getFullYear()>parseInt(editedAppointment.year_booked) ||
                                        new Date().getFullYear()===parseInt(editedAppointment.year_booked) && new Date().getMonth()+1>parseInt(editedAppointment.month_booked) ||
                                        new Date().getFullYear()===parseInt(editedAppointment.year_booked) && new Date().getMonth()+1===parseInt(editedAppointment.month_booked) && new Date().getDate()>=parseInt(editedAppointment.day_booked) ||
                                        (
                                            editedAppointment.address==='salon' &&
                                                    appointments.some(
                                                        appointment => 
                                                            appointment.id !== editedAppointment.id &&
                                                            appointment.date_booked.split('-')[0] === editedAppointment.year_booked &&
                                                            appointment.date_booked.split('-')[1] === editedAppointment.month_booked &&
                                                            appointment.date_booked.slice(0,10).split('-')[2] === editedAppointment.day_booked &&
                                                            appointment.time_return > editedAppointment.time_start &&
                                                            appointment.time_depart < addMinutes(editedAppointment.time_start, editedAppointment.duration)
                                                    )
                                        ) ||
                                        (
                                            editedAppointment.address!=='salon' &&
                                                    appointments.some(
                                                        appointment => 
                                                            appointment.id !== editedAppointment.id &&
                                                            appointment.date_booked.split('-')[0] === editedAppointment.year_booked &&
                                                            appointment.date_booked.split('-')[1] === editedAppointment.month_booked &&
                                                            appointment.date_booked.slice(0,10).split('-')[2] === editedAppointment.day_booked &&
                                                            appointment.time_return > addMinutes(editedAppointment.time_start-100,30) &&
                                                            appointment.time_depart < addMinutes(editedAppointment.time_start, editedAppointment.duration+30)
                                                    )
                                        ) ||
                                        !editedAppointment.name ||
                                        !editedAppointment.name.match(wordRegex) ||
                                        !editedAppointment.email ||
                                        !editedAppointment.email.match(emailRegex) ||
                                        !editedAppointment.telephone ||
                                        !editedAppointment.telephone.match(telRegex) ||
                                        !editedAppointment.address ||
                                        !editedAppointment.address.match(addressRegex)
                                ">
                                    O
                                </span>
                                <span v-else @click="updateAppointment" class="edit">O</span>
                                <span @click="editingAppointment=null" class="delete">X</span>
                            </div>
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
                    <div class="entry-wrapper" v-for="care in cares" :key="care.id">
                        <div class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>{{ decode(care.name) }}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{{ decode(care.short_description) }}</p>
                                </div>
                                <div>
                                    <div>
                                        <p>Durée : {{ care.min_duration }} minutes à {{ care.max_duration }} minutes</p>
                                        <p>Déplacement : {{ !care.is_home&&!care.is_structure&&!care.is_company?'Non':'Oui' }}</p>
                                    </div>
                                    <div>
                                        <p>Prix : {{ monisation(care.price) }} /h</p>
                                        <p v-if="care.is_home||care.is_structure||care.is_company">Frais de déplacement : {{ monisation(care.travel_expenses) }}</p>
                                        <p v-if="care.is_whole_day">Prix à la journée : {{ monisation(care.day_price) }}</p>
                                    </div>
                                </div>
                            </div>
                        <div class="actions"><span @click="console.log(care.id)" class="edit">E</span><span @click="console.log(care.id)" class="delete">X</span></div>
                        </div>
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
                    <div class="entry-wrapper" v-for="event in events" :key="event.id">
                        <div class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>{{ event.title }}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{{ event.short_text }}</p>
                                </div>
                            </div>
                            <div class="actions"><span @click="console.log(event.id)" class="edit">E</span><span @click="console.log(event.id)" class="delete">X</span></div>
                        </div>
                    </div>
                    <div class="card-entries" @click="console.log('add')">
                        <p>+</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <h3  @click="toggleMiscellaneous_texts">Textes du site</h3>
            <div ref="miscellaneous_textsContent" 
                class="menu-content" 
                :style="{ maxHeight: miscellaneous_textsOpen ? miscellaneous_textsHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && miscellaneous_texts.length<1">Aucune signature</p>
                </div>
                <div class="card-content" v-if="!isLoading && miscellaneous_texts.length">
                    <div class="entry-wrapper" v-for="(misc, index) in miscellaneous_texts" :key="misc.id">
                        <div :class="{invisible: index===editingMiscellaneous_text}" class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>{{ miscellaneous_texts[0]===misc?"Phrase d'accroche":"Texte de la page d'info" }}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{{ decode(misc.text) }}</p>
                                </div>
                            </div>
                            <div class="actions">
                                <span v-if="misc.id===1" @click="miscellaneous_textEdit(index, misc)" class="edit">E</span>
                                <span v-else @click="console.log(`routerlink to ${misc.id}`)" class="edit">E</span>
                            </div>
                        </div>
                        <form :class="{invisible: index!==editingMiscellaneous_text}" class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>{{ miscellaneous_texts[0]===misc?"Phrase d'accroche":"Texte de la page d'info" }}</p>
                                    </div>
                                </div>
                                <div>
                                    <textarea v-model="editedMiscellaneous_text.text" :name="'misc'+misc.id" :id="'misc'+misc.id" cols="45" rows="10"></textarea>
                                    <span style="color: #aa3333" v-if="!editedMiscellaneous_text.text" >Requis</span>
                                    <span style="color: #aa3333" v-if="editedMiscellaneous_text.text && !editedMiscellaneous_text.text.match(descriptionRegex)" >Invalide</span>
                                </div>
                            </div>
                            <div class="actions">
                                <span v-if="!editedMiscellaneous_text.text || !editedMiscellaneous_text.text.match(descriptionRegex)" >E</span>
                                <span v-else @click="updateMiscellaneous_text" class="edit">E</span>
                                <span @click="editingMiscellaneous_text=null" class="delete">X</span>
                            </div>
                        </form>
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
                    <div class="entry-wrapper" v-for="guest in guestbook" :key="guest.id">
                        <div class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>{{ decode(guest.title) }}</p>
                                    </div>
                                    <p>{{ guest.is_displayed?'Visible':'Non Visible' }}</p>
                                </div>
                                <div>
                                    <p>{{ decode(guest.name) }}</p>
                                    <p>{{ decode(guest.telephone) }} {{ banned_users.find(user => user.telephone === guest.telephone)?"Numéro banni":"" }}</p>
                                </div>
                                <div>
                                    <p>{{ decode(cares.find(care => care.id === guest.care_id)?.name || '') }}</p>
                                    <p>{{ decode(guest.text).length<255?decode(guest.text):decode(guest.text).slice(0,255)+'...' }}</p>
                                </div>
                            </div>
                            <div class="actions">
                                <span @click="console.log(guest.id)" class="edit">V</span>
                                <span @click="console.log('ban :'+guest.telephone)" class="delete">B</span>
                                <span @click="console.log(guest.id)" class="delete">X</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <h3  @click="toggleBanned_users">Numéros bannis</h3>
            <div ref="banned_usersContent" 
                class="menu-content" 
                :style="{ maxHeight: banned_usersOpen ? banned_usersHeight : '0px' }">
                <div class="loading">
                    <LoadingSpinner v-if="isLoading"/>
                    <p v-if="!isLoading && banned_users.length<1">Aucune signature</p>
                </div>
                <div class="card-content" v-if="!isLoading && banned_users.length">
                    <div class="entry-wrapper" v-for="user in banned_users" :key="user.id">
                        <div class="card-entries">
                            <div>
                                <div>
                                    <div>
                                        <p>Téléphone : {{ decode(user.telephone) }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="actions">
                                <span @click="deleteBanned_user(user.id)" class="delete">X</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-entries">
                        <p :class="{invisible:creatingBanned_user}" @click="banned_userCreate">+</p>
                        <form :class="{invisible:!creatingBanned_user}">
                            <div>
                                <div>
                                    <div>
                                        <p>
                                            <label name="newBanned_user" for="newBanned_user">
                                                Téléphone :
                                                <input v-model="createdBanned_user.telephone" type="tel" name="newBanned_user" id="newBanned_user">
                                            </label>
                                            <span v-if="!createdBanned_user.telephone" style="color: #aa3333">Requis</span>
                                            <span v-if="createdBanned_user.telephone && !createdBanned_user.telephone.match(telRegex)" style="color: #aa3333">Invalide</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="actions">
                                <span v-if="!createdBanned_user.telephone || !createdBanned_user.telephone.match(telRegex)">O</span>
                                <span v-else @click="createBanned_user" class="edit">O</span>
                                <span @click="creatingBanned_user=false" class="delete">X</span>
                            </div>
                        </form>
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
import monisation from '@/modules/monisation';
import addMinutes from '@/modules/addMinutes';
import InfoModal from '@/components/InfoModal.vue';

const modalOpen = ref(false);
const modalTitle = ref("");
const modalText = ref("");
const token = ref<string>(localStorage.getItem('token')||'');
const users = ref();
const miscellaneous_texts = ref();
const appointments = ref();
const banned_users = ref();
const cares = ref();
const events = ref();
const guestbook = ref();
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');
const creatingBanned_user = ref<boolean>(false);
const editingUser = ref<number>();
const editingMiscellaneous_text = ref<number>();
const editingAppointment = ref<number>();
const editedUser = ref({
    id: 0,
    email: '',
    password: '',
    password_confirm: ''
});
const editedMiscellaneous_text = ref({
    id: 0,
    text: '',
    filespaths: '',
    filesnames: '',
    filesdescriptions: ''
});
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
const createdBanned_user = ref({
    telephone: ''
});
const usersContent = ref(null);
const miscellaneous_textsContent = ref(null);
const appointmentsContent = ref(null);
const banned_usersContent = ref(null);
const caresContent = ref(null);
const eventsContent = ref(null);
const guestbookContent = ref(null);
const usersOpen = ref(false);
const miscellaneous_textsOpen = ref(false);
const appointmentsOpen = ref(false);
const banned_usersOpen = ref(false);
const caresOpen = ref(false);
const eventsOpen = ref(false);
const guestbookOpen = ref(false);
const usersHeight = ref("0px");
const miscellaneous_textsHeight = ref("0px");
const appointmentsHeight = ref("0px");
const banned_usersHeight = ref("0px");
const caresHeight = ref("0px");
const eventsHeight = ref("0px");
const guestbookHeight = ref("0px");
let resizeObserver;

const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;
const descriptionRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ,.:!?$€£¥)(\s\-']{1,255}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const telRegex = /^[0-9]{10,13}$/;
const addressRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;

const toggleUsers = async () => {
    usersOpen.value = !usersOpen.value;
    await nextTick();
    usersHeight.value = usersOpen.value 
    ? usersContent.value.scrollHeight + "px"
    : "0px";
};

const toggleMiscellaneous_texts = async () => {
    miscellaneous_textsOpen.value = !miscellaneous_textsOpen.value;
    await nextTick();
    miscellaneous_textsHeight.value = miscellaneous_textsOpen.value 
    ? miscellaneous_textsContent.value.scrollHeight + "px"
    : "0px";
};

const toggleAppointments = async () => {
    appointmentsOpen.value = !appointmentsOpen.value;
    await nextTick();
    appointmentsHeight.value = appointmentsOpen.value 
    ? appointmentsContent.value.scrollHeight + "px"
    : "0px";
};

const toggleBanned_users = async () => {
    banned_usersOpen.value = !banned_usersOpen.value;
    await nextTick();
    banned_usersHeight.value = banned_usersOpen.value 
    ? banned_usersContent.value.scrollHeight + "px"
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

const userEdit = async (index :number, user) :void => {
    editingUser.value = index;
    editedUser.value = transformUser(user);
    await nextTick();
    usersHeight.value = usersContent.value.scrollHeight + "px";
}

const miscellaneous_textEdit = async (index :number, miscellaneous_text) :void => {
    editingMiscellaneous_text.value = index;
    editedMiscellaneous_text.value = transformMiscellaneous_text(miscellaneous_text);
    await nextTick();
    miscellaneous_textsHeight.value = miscellaneous_textsContent.value.scrollHeight + "px";
}

const appointmentEdit = async (index :number, appointment) :void => {
    editingAppointment.value = index;
    editedAppointment.value = transformAppointment(appointment);
    await nextTick();
    appointmentsHeight.value = appointmentsContent.value.scrollHeight + "px";
}

const banned_userCreate = async (index :number, user) :void => {
    creatingBanned_user.value = true;
    await nextTick();
    banned_usersHeight.value = appointmentsContent.value.scrollHeight + "px";
}

const transformUser = (user) => ({
    ...user,
    email: decode(user.email),
    password: '',
    password_confirm: '',
});

const transformMiscellaneous_text = (miscellaneous_text) => ({
    ...miscellaneous_text,
    text: decode(miscellaneous_text.text),
});

const transformAppointment = (appointment) => ({
    ...appointment,
    address: decode(appointment.address),
    name: decode(appointment.name),
    email: decode(appointment.email),
    date_booked: appointment.date_booked.slice(0,10),
    year_booked: appointment.date_booked.split('-')[0],
    month_booked: appointment.date_booked.split('-')[1],
    day_booked: appointment.date_booked.slice(0,10).split('-')[2],
    duration: durationBetween(appointment.time_start, appointment.time_end),
});

const resetBanned_user = (user) => ({
    telephone: '',
});

const createBanned_user = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/banned_users/create`, {
          method: "post",
          headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`},
          body: JSON.stringify(createdBanned_user.value)
        });
        if(res.status!==200){
            modalTitle.value = "Échec"
            modalText.value = "Le blocage de numéro n'a pas pu avoir lieu."
            modalOpen.value = true;
            creatingBanned_user.value = false;
            resetBanned_user(createdBanned_user);
            await nextTick();
            banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
            return;
        }
        else{
            banned_users.value.push(createdBanned_user.value);
            modalTitle.value = "Succès"
            modalText.value = "Le numéro a été bloqué."
            modalOpen.value = true;
            creatingBanned_user.value = false;
            resetBanned_user(createdBanned_user);
            await nextTick();
            banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
            return;
        }
    } catch(err) {
        console.error(err);
        modalTitle.value = "Échec"
        modalText.value = "Le blocage de numéro n'a pas pu avoir lieu."
        modalOpen.value = true;
        resetBanned_user(createdBanned_user);
        await nextTick();
        banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
        return;
    }
    creatingBanned_user.value = false;
    resetBanned_user(createdBanned_user);
}

const updateUser = async () => {
    const id = editedUser.value.id;
    const updatingUser = {
        email : editedUser.value.email,
        password : editedUser.value.password
    }
    try {
        const res = await fetch(`http://localhost:3000/api/users/update/${id}`, {
          method: "put",
          headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`},
          body: JSON.stringify(updatingUser)
        });
        if(res.status!==200){
            userEdit(editingUser.value, editedUser.value);
            modalTitle.value = "Échec"
            modalText.value = "La modification de l'administrateur n'a pas pu avoir lieu."
            modalOpen.value = true;
            editingUser.value = undefined;
            return;
        }
        else{
            const updatedIndex = users.value.findIndex((user) => user.id === id);
            if (updatedIndex !== -1) {
                users.value[updatedIndex] = {
                    ...users.value[updatedIndex],
                    ...updatingUser,
                };
            }
            modalTitle.value = "Succès"
            modalText.value = "L'administrateur a été modifié."
            modalOpen.value = true;
            editingUser.value = undefined;
            return;
        }
    } catch(err) {
        console.error(err);
        modalTitle.value = "Échec"
        modalText.value = "La modification de l'administrateur n'a pas pu avoir lieu."
        modalOpen.value = true;
        return;
    }
    editingUser.value = undefined;
}

const updateMiscellaneous_text = async () => {
    const id = editedMiscellaneous_text.value.id;
    const updatingMiscellaneous_text = {
        text : editedMiscellaneous_text.value.text,
        filesdescriptions : []
    }
    try {
        const res = await fetch(`http://localhost:3000/api/miscellaneous_texts/update/${id}`, {
          method: "put",
          headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`},
          body: JSON.stringify(updatingMiscellaneous_text)
        });
        if(res.status!==200){
            miscellaneous_textEdit(editingMiscellaneous_text.value, editedMiscellaneous_text.value);
            modalTitle.value = "Échec"
            modalText.value = "La modification de la phrase d'accroche n'a pas pu avoir lieu."
            modalOpen.value = true;
            editingMiscellaneous_text.value = undefined;
            return;
        }
        else{
            const updatedIndex = miscellaneous_texts.value.findIndex((misc) => misc.id === id);
            if (updatedIndex !== -1) {
                miscellaneous_texts.value[updatedIndex] = {
                    ...miscellaneous_texts.value[updatedIndex],
                    ...updatingMiscellaneous_text,
                };
            }
            modalTitle.value = "Succès"
            modalText.value = "La phrase d'accroche a été modifiéé."
            modalOpen.value = true;
            editingMiscellaneous_text.value = undefined;
            return;
        }
    } catch(err) {
        console.error(err);
        modalTitle.value = "Échec"
        modalText.value = "La modification de la phrase d'accroche n'a pas pu avoir lieu."
        modalOpen.value = true;
        return;
    }
    editingMiscellaneous_text.value = undefined;
}

const updateAppointment = async () => {
    editedAppointment.value.date_booked = `${editedAppointment.value.year_booked}-${editedAppointment.value.month_booked}-${editedAppointment.value.day_booked}`;
    const id = editedAppointment.value.id;
    const updatingAppointment = {
        care_id: editedAppointment.value.care_id,
        address: editedAppointment.value.address,
        name: editedAppointment.value.name,
        email: editedAppointment.value.email,
        telephone: editedAppointment.value.telephone,
        date_booked: editedAppointment.value.date_booked,
        time_start: editedAppointment.value.time_start,
        duration: editedAppointment.value.duration
    }
    try {
        const res = await fetch(`http://localhost:3000/api/appointments/update/${id}`, {
          method: "put",
          headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`},
          body: JSON.stringify(updatingAppointment)
        });
        if(res.status!==200){
            appointmentEdit(editingAppointment.value, editedAppointment.value);
            modalTitle.value = "Échec"
            modalText.value = "La modification du rendez-vous n'a pas pu avoir lieu."
            modalOpen.value = true;
            editingAppointment.value = undefined;
            return;
        }
        else{
            const updatedIndex = appointments.value.findIndex((appointment) => appointment.id === id);
            if (updatedIndex !== -1) {
                appointments.value[updatedIndex] = {
                    ...appointments.value[updatedIndex],
                    ...updatingAppointment,
                };
            }
            modalTitle.value = "Succès"
            modalText.value = "Le rendez-vous a été modifié."
            modalOpen.value = true;
            editingAppointment.value = undefined;
            return;
        }
    } catch(err) {
        console.error(err);
        modalTitle.value = "Échec"
        modalText.value = "La modification du rendez-vous n'a pas pu avoir lieu."
        modalOpen.value = true;
        return;
    }
}

const deleteBanned_user = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/banned_users/delete/${id}`, {
          method: "delete",
          headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${token.value}`}
        });
        if(res.status!==200){
            modalTitle.value = "Échec"
            modalText.value = "Le numéro n'a pas pu été authorisé."
            modalOpen.value = true;
            await nextTick();
            banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
            return;
        }
        else{
            const updatedIndex = banned_users.value.findIndex((user) => user.id === id);
            banned_users.value.splice(updatedIndex, 1);
            modalTitle.value = "Succès"
            modalText.value = "Le numéro a été authorisé."
            modalOpen.value = true;
            await nextTick();
            banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
            return;
        }
    } catch(err) {
        console.error(err);
        modalTitle.value = "Échec"
        modalText.value = "Le numéro n'a pas pu été authorisé."
        modalOpen.value = true;
        await nextTick();
        banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
        return;
    }
}

onMounted(async () => {
    resizeObserver = new ResizeObserver(() => {
    if (usersOpen.value) {
        usersHeight.value = usersContent.value.scrollHeight + "px";
    }
    if (miscellaneous_textsOpen.value) {
        miscellaneous_textsHeight.value = miscellaneous_textsContent.value.scrollHeight + "px";
    }
    if (appointmentsOpen.value) {
        appointmentsHeight.value = appointmentsContent.value.scrollHeight + "px";
    }
    if (banned_usersOpen.value) {
        banned_usersHeight.value = banned_usersContent.value.scrollHeight + "px";
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
        if (miscellaneous_textsContent.value) resizeObserver.observe(miscellaneous_textsContent.value);
        if (appointmentsContent.value) resizeObserver.observe(appointmentsContent.value);
        if (banned_usersContent.value) resizeObserver.observe(banned_usersContent.value);
        if (caresContent.value) resizeObserver.observe(caresContent.value);
        if (eventsContent.value) resizeObserver.observe(eventsContent.value);
        if (guestbookContent.value) resizeObserver.observe(guestbookContent.value);

        const tokenHeader = { Authorization: `bearer ${token.value}` };
        const responses = await Promise.all([
            fetch('http://localhost:3000/api/users/', {
                headers: { 'Content-Type': 'application/json', ...tokenHeader },
            }),
            fetch('http://localhost:3000/api/miscellaneous_texts/', {
                headers: { 'Content-Type': 'application/json' },
            }),
            fetch('http://localhost:3000/api/appointments/', {
                headers: { 'Content-Type': 'application/json' },
            }),
            fetch('http://localhost:3000/api/banned_users/', {
                headers: { 'Content-Type': 'application/json', ...tokenHeader },
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

        [users.value, miscellaneous_texts.value, appointments.value, banned_users.value, cares.value, events.value, guestbook.value] = jsonResponses;
    } catch (err) {
        console.error(err);
        loadingError.value = 'Erreur de connexion au serveur';
        return;
    } finally {
        isLoading.value = false;
    }
})

onBeforeUnmount(() => {
  resizeObserver.unobserve(usersContent.value);
  resizeObserver.unobserve(miscellaneous_textsContent.value);
  resizeObserver.unobserve(appointmentsContent.value);
  resizeObserver.unobserve(banned_usersContent.value);
  resizeObserver.unobserve(caresContent.value);
  resizeObserver.unobserve(eventsContent.value);
  resizeObserver.unobserve(guestbookContent.value);
  resizeObserver.disconnect();
});
</script>

<style scoped>
.wrapper {
    margin: 0 auto;
    padding-top: 2rem;
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

.card-entries>div:first-of-type {
    display: flex;
    flex-direction: column;
}

.card-entries>div:first-of-type>div:first-of-type {
    display: flex;
    justify-content: space-between;
}

.card-entries>div:first-of-type>div:first-of-type>div {
    font-weight: bold;
    display: flex;
    flex-direction: column;
}

.card-entries>div:first-of-type>div:first-of-type>div:last-of-type {
    text-align: end;
}

.card-entries>div:first-of-type {
    gap: 0.5rem;
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
}

h3 {
    text-align: center;
    color: #fbf9ea;
    /* background-color: #B398C9; */
    background-color: #234899;
    border-radius: 5px;
}

h3, .edit, .delete, .button {
    cursor: pointer;
}

.button {
    color: #fbf9ea;
    background-color: #234899;
    width: 100%;
    padding: 0 10px;
    border: #fbf9ea solid 1px;
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
        gap: 0.75rem;
    }

    .button {
        width: fit-content;
    }
}
</style>