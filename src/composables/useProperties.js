import { computed, ref } from 'vue'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'//Collection: we need all the records of our db
import { collection, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'

export default function useProperties() {

    const pool = ref(false)
    //Identifying the firebase storage where we are uploading our storage files (images)
    const storage = useFirebaseStorage()
    //Credentials of our database in firebase
    const db = useFirestore()
    //Firebase is a noSQL and realtime database
    //This is like a SELECT sentence (but in noSQL database), but by using firebase and vuefire
    //This is all the info that que have in the database in firebase (That info is available in our state)
    const propertiesCollection = useCollection(collection(db, 'properties'))

    async function deleteItem(id, urlImage) {
        if(confirm('Do you want to delete this property?')) {
            //Identify the document to delete by his id
            const docRef = doc(db, 'properties', id)
            //Reference of the image that we want to delete (to delete the image from firebase storage)
            const imageRef = storageRef(storage, urlImage)

            //In this case we have two awaits, we can use a general await. So, this two await are gonne execute
            //at the same time
            await Promise.all([
                //Deleting the document
                deleteDoc(docRef),
                //Deleting the image of the firebase storage
                deleteObject(imageRef)
            ])
        }
    }

    const filteredItems = computed(() => {
        return pool.value ? 
            //Filter if the property has a pool
            propertiesCollection.value.filter( property => property.pool ) :
            //If the filter is no selected, get all the properties
            propertiesCollection.value
    })

    //In computed properties we cannot pass parameters (computed cannot take a valour). But in this case we 
    //need to pass the price of the property, so, we can use a cllback in the return with the price of the property
    // const propertyPrice = computed(() => {
    //     //return with a callback
    //     return (price) => 
    //         //Giving a price format to price of the property
    //         Number(price).toLocaleString('en-US', {
    //             style: 'currency',
    //             currency: 'USD'
    //         })
    // })

    return {
        pool,
        propertiesCollection,
        // propertyPrice
        filteredItems,
        deleteItem
    }
}