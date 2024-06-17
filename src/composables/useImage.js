import { computed } from 'vue'
import { ref as storageRef } from 'firebase/storage'//This is a ref from firebase, not the one of vue
import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { uid } from 'uid'

export default  function useImage() {

    const storage = useFirebaseStorage()
    //Is gonna get the location of the image that we gonna upload
    const storageRefPath = storageRef(storage, `/properties/${uid()}.jpg`)//uid is the unique name for each image

    //url: is where was stored each image
    //upload: function that allows upload the image to the server of firebase
    const { 
        url, 
        upload 

    } = useStorageFile(storageRefPath)

    function uploadImage(e) {
        //Read the image that was uploaded
        const data = e.target.files[0]
        //If we have data, uploading the image to our storage in firebase
        if(data) {
            upload(data)
        }
    }

    const imagePreview = computed(() => {
        //If url.value have something, returns url.value. If not, returns null
        return url.value ? url.value : null
    })

    return {
        url,
        uploadImage,
        imagePreview
    }
}