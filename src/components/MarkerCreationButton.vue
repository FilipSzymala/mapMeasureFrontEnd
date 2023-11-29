<template>
    <button @click="toggleMarkerCreation" v-if="markerCreation">Disable Marker Creation</button>
    <button @click="toggleMarkerCreation" v-else>Enable Marker Creation</button>
</template>
<script>
export default {
    props: {
        markerCreation: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        toggleMarkerCreation() {
            this.$emit('toggleMarkerCreation', !this.markerCreation);
        }
    }
}
</script>
<style scoped>
button {
    justify-self: center;
    grid-column: 1/-1;
    background-color: var(--secondary-color);
    border: 0;
    padding: 1em 3em;
    border-radius: .75em;
    color: var(--text-color);
    font-weight: 300;
    font-size: 1.25rem;
    transform: scale(.95);
    transition: .5s transform;
}

button:hover,
button:focus {
    transform: scale(1);
    box-shadow: 0px 6px 20px rgba(13, 44, 79, 0.5);
    outline: none;
}

@media(max-width: 1100px) {
    button {
        order: 2;
    }
}
</style>