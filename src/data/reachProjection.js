export function project(frame, lon, lat) {
  const x = ((lon - frame.minLon) / (frame.maxLon - frame.minLon)) * frame.width
  const mercator = (value) => Math.log(Math.tan(Math.PI / 4 + (value * Math.PI) / 360))
  const y = (1 - (mercator(lat) - mercator(frame.minLat)) / (mercator(frame.maxLat) - mercator(frame.minLat))) * frame.height
  return [x, y]
}
