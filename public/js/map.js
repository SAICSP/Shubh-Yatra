mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates, 
    zoom: 1
});
            
const marker = new mapboxgl.Marker({color:'Red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset :25}).setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after Booking</p>`)
    )
    .addTo(map);

console.log(coordinates);