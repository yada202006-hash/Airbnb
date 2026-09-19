mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
        // accessToken: 'pk.eyJ1Ijoic29udTkzMTAiLCJhIjoiY211Mnk1MnBhMDF1bjJ3cXphdWtpbWp2aiJ9.TGQw7zAS9gbMzLHexqP7ag',
        container: 'map', // container ID
        center:  coordinates, // coordinates krr dee last mee project ke badd// starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
});
console.log(coordinates);
const marker=new mapboxgl.Marker({color:"red"}).setLngLat(coordinates).addTo(map);
