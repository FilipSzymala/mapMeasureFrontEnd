<template>
    <div id="map"></div>
</template>
  
<script>
import axios from "axios";
import uniqid from 'uniqid';
import { deleteMarker } from '@/util/deleteMarker';

export default {
    props: {
        markerCreation: {
            type: Boolean,
            required: true,
        },
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
            map: null,
        };
    },
    mounted() {
        this.initMap();
    },
    methods: {
        async initMap() {
            const position = { lat: 51.624980, lng: 20.816150 };

            try {
                const { Map } = await google.maps.importLibrary('maps');

                this.map = new Map(document.getElementById('map'), {
                    zoom: 6,
                    center: position,
                    mapId: 'user_map',
                });

                this.map.addListener('click', (event) => {
                    if (this.markerCreation) {
                        this.createMarker(event.latLng);
                    }
                });

                const markerData = await axios.get("http://127.0.0.1:8000/get-marker-data").then(
                    res => res.data
                ).catch(err => {
                    console.error(err);
                });

                markerData.forEach(data => {
                    const newMarker = new google.maps.Marker({
                        position: { lat: data.latitude, lng: data.longitude },
                        map: this.map,
                        title: data.name,
                    });

                    newMarker.setValues({ id: data.id })

                    newMarker.addListener("click", () => {
                        this.callDeleteMarker(data.id, this.markerPairs, this.polylines)
                    });

                    // group markers in pairs so it's easier to draw polylines between them
                    if (this.markerPairs.length && this.markerPairs[this.markerPairs.length - 1].length != 2) {
                        this.markerPairs[this.markerPairs.length - 1].push(newMarker);
                    } else {
                        this.markerPairs.push([newMarker]);
                    }

                    if (this.markerPairs.length && this.markerPairs[this.markerPairs.length - 1].length > 1) {
                        this.updatePolyline();
                    }
                })
            } catch (error) {
                console.error('Failed to load Google Maps library:', error);
            }
        },
        async createMarker(position) {
            const marker = new google.maps.Marker({
                position: position,
                map: this.map,
            });

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: position }, async (res) => {
                const formatedAddress = `${res[0].address_components[1].long_name}, ${res[0].address_components[4].long_name}`;
                marker.setValues({ id: uniqid(), title: formatedAddress })

                marker.addListener("click", () => {
                    this.callDeleteMarker(marker.id, this.markerPairs, this.polylines)
                });

                // group markers in pairs so it's easier to draw polylines between them
                if (this.markerPairs.length && this.markerPairs[this.markerPairs.length - 1].length != 2) {
                    this.markerPairs[this.markerPairs.length - 1].push(marker);
                } else {
                    this.markerPairs.push([marker]);
                }

                if (this.markerPairs.length && this.markerPairs[this.markerPairs.length - 1].length > 1) {
                    this.updatePolyline();
                }

                await axios.post("http://127.0.0.1:8000/create-marker", {
                    "id": marker.id,
                    "name": marker.title,
                    "longitude": position.lng(),
                    "latitude": position.lat()
                }).catch(err => {
                    console.error(err);
                });

            })



        },
        updatePolyline() {
            // Create or update the polyline if there are at least two markers
            this.markerPairs.forEach((markerPair, index) => {
                this.polylines[index] = new google.maps.Polyline({
                    path: [markerPair[0].getPosition(), markerPair[1].getPosition()],
                    map: this.map,
                });
            })
        },
        async callDeleteMarker(id, markerPairs, polylines) {
            this.loading = true;
            try {
                await deleteMarker(id, markerPairs, polylines);
            } finally {
                this.loading = false;
            }
        }

    },
};
</script>