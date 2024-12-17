<template>
    <div :class="{invisible: !props.isOpen}" @click="closeModal" class="wrapper">
        <div class="modal">
            <h3>{{ props.title }}</h3>
            <p>{{ props.text }}</p>
            <p>Appuyez quelquepart pour fermer.</p>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    isOpen: Boolean,
    title: String,
    text: String
});

const emit = defineEmits(["emitModal"]);

const closeModal = () => emit("emitModal");
</script>

<style scoped>
.invisible {
    display: none;
}

.wrapper {
    position: fixed;
    top: -0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #00000080;
}

.modal {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    text-align: left;
    min-height: 30%;
    min-width: 40%;
    background-color: #fbf9ea;
    border-radius: 25px;
    overflow: hidden;
}

h3, p {
    margin: 0;
    padding: 1rem;
}
h3 {
    color: #fbf9ea;
    background-color: #234899;
}
</style>