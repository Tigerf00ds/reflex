<template>
    <div class="loader"></div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader {
    margin: 2rem auto;
    border: 16px solid transparent;
    border-top: 16px solid #234899;
    border-radius: 50%;
    width: 50%;
    aspect-ratio: 1/1;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>