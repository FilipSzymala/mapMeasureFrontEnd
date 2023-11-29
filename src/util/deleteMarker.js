import { removePolyline } from "@/util/removePolyline";
import { toRaw } from "vue";
import axios from "axios";

export async function deleteMarker(id, markerPairs, polylines) {
  let temp = null;

  // Find the pair index that contains the marker to be deleted
  markerPairs.forEach((markerPair, index) => {
    markerPair.forEach((marker) => {
      if (marker.id === id) temp = index;
    });
  });

  // Remove marker from the map
  if (markerPairs[temp].length > 1) {
    toRaw(markerPairs)[temp][0].setMap(null);
    toRaw(markerPairs)[temp][1].setMap(null);
  } else {
    toRaw(markerPairs)[temp][0].setMap(null);
  }

  await axios
    .post(
      `http://127.0.0.1:8000/delete-marker/${toRaw(markerPairs)[temp][0].id}`
    )
    .catch((err) => {
      console.error(err);
    });
  await axios
    .post(
      `http://127.0.0.1:8000/delete-marker/${toRaw(markerPairs)[temp][1].id}`
    )
    .catch((err) => {
      console.error(err);
    })
    .then(() => {
      // Remove marker pair with the clicked marker from the array
      markerPairs.splice(temp, 1);

      // Remove polyline
      removePolyline(temp, polylines);
    });
}
