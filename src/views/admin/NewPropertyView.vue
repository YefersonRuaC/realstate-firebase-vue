<script setup>
    import { useForm, useField } from 'vee-validate'
    import { collection, addDoc } from 'firebase/firestore'//addDoc: using to add a nes document to our db
    import { useFirestore } from 'vuefire'
    import { useRouter } from 'vue-router'
    import { validationSchema, imageSchema } from '@/validation/propertySchema' //@ points to src folder
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

    const items = [1,2,3,4,5]

    //Destructuring to our composables
    const { url, uploadImage, imagePreview } = useImage()
    const { zoom, center, pin } = useLocationMap()

    const router = useRouter()

    //With useFirestore() and our firebase credentials in (.env). Our project is gonna comunicate with firebase
    //(cloud firestore)
    const db = useFirestore()

    //Destructuring of handleSubmit, function from useForm()
    const { handleSubmit } = useForm({
        //With useForm() only we can pass one validation schema. But in this case, we have two
        validationSchema : {
            //So using spread operator, we can combine two validation schemas in only one object
            ...validationSchema,
            ...imageSchema
        }
    })

    //Validation, matching our inputs with useField
    const title = useField('title')
    const image = useField('image')
    const price = useField('price')
    const rooms = useField('rooms')
    const wc = useField('wc')
    const parking = useField('parking')
    const description = useField('description')
    //We can whether or not add a pool
    const pool = useField('pool', null, {
        //Assign a initial value to prevent de issue about undefinied when the admin don't add the check in 
        //the pool
        initialValue: false
    })

    const submit = handleSubmit( async(values) => {
        //We take out image from de values object. And we keep the others fields (title, price, rooms, wc, etc)
        const { image, ...property } = values 
        // console.log(property)

        // Add a new document with a generated id
        const docRef = await addDoc(collection(db, "properties"), {
            //Saving with the object
            // property

            //Saving without the object (only data or values)
            ...property,
            //Saving que rul of the image (this image was uploaded in firebase). And assign in image, to save
            //this image url in our firestore database
            image: url.value,
            //Adding the ubication of the pin in our firestore database
            ubication: center.value
        });

        //If a new id is generated (Property is saved succesfully). 
        if(docRef.id) {
            // Then user is redirected for only give one chance to send the form
            router.push({name: 'admin-properties'})
        }
    })

</script>

<template>
    <v-card max-width="800" flat class="mx-auto my-5">
        <v-card-title
            class="text-h4 font-weight-bold"
        >
            New property
        </v-card-title>
        <v-card-subtitle
            class="text-h5"
        >
            Create a new property by filling this form
        </v-card-subtitle>

        <v-form class="my-7">
            <v-text-field 
                class="mb-5"
                label="Property title"
                v-model="title.value.value"
                :error-messages="title.errorMessage.value"
            />

            <v-file-input
                accept="image/jpeg"
                label="Photography"
                prepend-icon="mdi-camera"
                class="mb-5"
                v-model="image.value.value"
                :error-messages="image.errorMessage.value"
                @change="uploadImage"
            />

            <div v-if="imagePreview" class="my-5">
                <p class="font-weight-bold">Property image: </p>
                <img class="w-50" :src="imagePreview">
            </div>

            <v-text-field
                class="mb-5"
                label="Price"
                v-model="price.value.value"
                :error-messages="price.errorMessage.value"
            />

            <v-row>
                <v-col cols="12" md="4">
                    <v-select 
                        label="Rooms"
                        class="mb-5"
                        :items="items"
                        v-model="rooms.value.value"
                        :error-messages="rooms.errorMessage.value"
                    />
                </v-col>
    
                <v-col cols="12" md="4">
                    <v-select 
                        label="WC"
                        class="mb-5"
                        :items="items"
                        v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value"
                    />
                </v-col>
    
                <v-col cols="12" md="4">
                    <v-select 
                        label="Parking slots"
                        class="mb-5"
                        :items="items"
                        v-model="parking.value.value"
                        :error-messages="parking.errorMessage.value"
                    />
                </v-col>
            </v-row>

            <v-textarea 
                class="mb-5" 
                label="Description"
                v-model="description.value.value"
                :error-messages="description.errorMessage.value"
            ></v-textarea>

            <v-checkbox 
                label="Pool"
                v-model="pool.value.value"
                :error-messages="pool.errorMessage.value"
            />

            <h2 class="font-weight-bold text-center mb-5">Location</h2>
            <div class="pb-10">
                <div style="height:600px">
                    <LMap 
                        v-model:zoom="zoom" 
                        :center="center" 
                        :use-global-leaflet="false"
                    >
                        <LMarker 
                            :lat-lng="center"
                            draggable
                            @moveend="pin"
                        />
                        <LTileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
            </div>

            <v-btn
                color="pink-accent-3"
                block
                @click="submit"
            >
                Add property
            </v-btn>
        </v-form>
    </v-card>
</template>