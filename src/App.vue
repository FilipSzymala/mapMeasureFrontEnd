<script>
import MapComponent from './components/MapComponent.vue';
import MarkerCreationButton from './components/MarkerCreationButton.vue';
import MarkersList from './components/MarkersList.vue';
export default {
  components: {
    MapComponent,
    MarkerCreationButton,
    MarkersList
  },
  data() {
    return {
      markerCreation: false,
      markerPairs: [],
      polylines: []
    }
  },
  methods: {
    toggleMarkerCreation(markerCreation) {
      this.markerCreation = markerCreation;
    }
  }
}
</script>

<template>
  <header>
    <h1>DistanceMeter</h1>
  </header>

  <main>
    <MapComponent :markerCreation="markerCreation" :markerPairs="markerPairs" :polylines="polylines" />
    <MarkersList :markerPairs="markerPairs" :polylines="polylines" />
    <MarkerCreationButton :markerCreation="markerCreation" @toggleMarkerCreation="toggleMarkerCreation" />
  </main>
</template>

<style>
:root {
  --text-color: #e5f0fb;
  --bg-color: #030c16;
  --primary-color: #2b7fde;
  --secondary-color: #0c2c50;
  --accent-color: #1d66b9;
}

*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  font-family: 'Open Sans', sans-serif;
}

h1 {
  font-size: 2.5rem;
}

h1,
h2,
h3 {
  color: var(--text-color);
}

header {
  width: 100%;
  height: 75px;
  display: grid;
  place-items: center;
  align-items: center;
  margin-bottom: 2.5em;
  background-color: var(--primary-color);
  box-shadow: 0 4px 10px 0px var(--secondary-color);
}

main {
  padding: 0 75px;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 700px;
  gap: 1.5rem 2rem;
}

button {
  cursor: pointer;
}

@media(max-width: 1100px) {

  main {
    grid-template-columns: 1fr;
    padding: 0 25px;
  }
}

@media(min-width: 1100px) and (max-width: 1685px) {
  main {
    grid-template-columns: 1fr 1fr;
    padding: 0 25px;
  }
}
</style>
