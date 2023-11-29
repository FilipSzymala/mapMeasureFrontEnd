<template>
    <div>
        <h2>Marker pairs' distances</h2>
        <ul class="marker-list">
            <li v-if="!loading && validMarkerPairs.length > 0" v-for="validPair in validMarkerPairs" :key="validPair"
                class="marker-list__item">
                <span class="marker-name">{{ validPair[0].title }} <br /> --- <br />
                    {{ validPair[1].title ? validPair[1].title : 'xd' }}</span>
                <span class="marker-distance">{{ calc_distance(validPair[0], validPair[1]) }} km</span>
                <button @click="callDeleteMarker(validPair[0].id, markerPairs, polylines)">
                    <img src="./icons/trash-can.svg" alt="delete icon" aria-label="delete this marker" />
                </button>
            </li>
            <h3 v-else-if="validMarkerPairs.length == 0" style="text-align: center;">Nothing to show, add some markers!</h3>
            <img v-else="loading" src="@/components/icons/loading-spinner.svg"
                style="position: relative; left: 50%; transform: translateX(-50%);" />
        </ul>
    </div>
</template>
<script>
import { deleteMarker } from '@/util/deleteMarker';

export default {
    props: {
        markerPairs: {
            type: Array,
            required: true
        },
        polylines: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        validMarkerPairs() {
            return this.markerPairs.filter(pair => pair.length > 1);
        },
    },
    methods: {
        calc_distance(mk1, mk2) {
            var R = 6371.071; // Radius of the Earth in kilometers
            var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
            var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
            var difflat = rlat2 - rlat1; // Radian difference (latitudes)
            var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)
            var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
            return d.toFixed(2);
        },
        async callDeleteMarker(id, markerPairs, polylines) {
            this.loading = true;
            try {
                await deleteMarker(id, markerPairs, polylines);
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>
<style scoped>
div {
    display: grid;
}

h2 {
    margin-top: 0;
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
    text-align: center;
}

.marker-list {
    overflow-y: auto;
}

.marker-list__item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    align-items: center;
    justify-items: center;
    column-gap: 1em;
    padding: 1em 1em;
    background-color: var(--text-color);
    border-radius: .75em;
    transform: scale(.9);
    transition: .5s all;
}

.marker-list__item:not(:last-child) {
    margin-bottom: .25em;
}

.marker-list__item:hover,
.marker-list__item:focus {
    transform: scale(.95);
    box-shadow: 0px 6px 20px rgba(13, 44, 79, 0.5);
    outline: none;
}

.marker-list:hover .marker-list__item:not(:hover) {
    transform: scale(.85);
}

/* item list card */
.marker-list__item>* {
    font-size: 1.5rem;
    text-align: center;
}

.marker-list__item>button {
    background-color: var(--bg-color);
    padding: .5em;
    border-radius: 100%;
    aspect-ratio: 1/1;
    transition: .5s all;
}

.marker-name {
    font-weight: 700;
}

.marker-list__item>button:hover {
    filter: invert(1);
}

.marker-list__item>button>img {
    filter: brightness(0) invert(1);
}

.marker-list__item>button {
    border: 0;
    outline: none;
}




@media(max-width: 1100px) {
    div {
        order: 3;
    }

    ul {
        overflow-y: auto;
        max-height: 360px;
    }
}
</style>