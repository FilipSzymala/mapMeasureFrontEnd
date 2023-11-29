export function removePolyline(deletePairIndex, polylines) {
  if (polylines[deletePairIndex]) {
    polylines[deletePairIndex].setMap(null);
    polylines.splice(deletePairIndex, 1);
  }
}
