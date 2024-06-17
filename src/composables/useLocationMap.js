import { ref } from 'vue'

export default function useLocationMap() {

    const zoom = ref(13)

    const center = ref([6.252105,-75.5880829,14])

    function pin(e) {
        //_latlng === getLatLng(). But _latlng (with underscore) is named a private property in JS
        // console.log(e.target._latlng)
        // console.log(e.target.getLatLng())
        const marker = e.target.getLatLng()
        //We need center as array, so we become the marker in an array
        center.value = [marker.lat, marker.lng]
    }

    return {
        zoom,
        center,
        pin
    }
}