mapboxgl.accessToken = '<%= process.env.MAP_TOKEN %>';
const listing = <%- JSON.stringify(list) %>;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates,
    zoom: 1
});

const marker = new mapboxgl.Marker({ color: 'Red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after Booking</p>`)
    )
    .addTo(map);
