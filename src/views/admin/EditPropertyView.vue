<script setup>
    import { watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useFirestore, useDocument } from 'vuefire'//Document: only need a one record to edit it 
    import { doc, updateDoc } from 'firebase/firestore'//doc: get the info of that specific document
    import { useField, useForm } from 'vee-validate'
    import "leaflet/dist/leaflet.css";
    import {
        LMap,
        LTileLayer,
        LMarker
    } from "@vue-leaflet/vue-leaflet";
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import { validationSchema } from '@/validation/propertySchema'

    const items = [1,2,3,4,5]

    const { url, uploadImage, imagePreview } = useImage()
    const { zoom, center, pin } = useLocationMap()

    const { handleSubmit } = useForm({ validationSchema });

    //Validation
    const title = useField('title')
    const image = useField('image')
    const price = useField('price')
    const rooms = useField('rooms')
    const wc = useField('wc')
    const parking = useField('parking')
    const description = useField('description')
    const pool = useField('pool')

    //Reading the url of the page
    const route = useRoute()
    //To redirect after the update
    const router = useRouter()
    //Getting the credentials of out app
    const db = useFirestore()
    //Getting the reference of the document. db=app. 'properties'=collection. route.params.id=document
    const docRef = doc(db, 'properties', route.params.id)
    // console.log(route.params.id) //Getting the property to update by using the url (useRoute)

    //property is the document to get edited
    const property = useDocument(docRef)

    //Filling the inputs
    //watch to fill the fields with the property info of our db
    watch(property, (property) => {//(property) is the property of our db
        title.value.value = property.title
        price.value.value = property.price
        rooms.value.value = property.rooms
        wc.value.value = property.wc
        parking.value.value = property.parking
        description.value.value = property.description
        pool.value.value = property.pool
        center.value = property.ubication
    })  

    const submit = handleSubmit( async(values) => {
        //Extract the image of the property object and making a copy of the property (without image)
        const { image, ...property } = values

        //If we have a new image
        if(imagePreview.value) {
            const data = {//data: is an object with the info of the fields (but hear we don't take the image), 
            //in this part of the conditional we keep the current image (not updating it)
                ...property,
                image: url.value,
                ubication: center.value
            }
            //Pass the reference of the document and the data
            await updateDoc(docRef, data)

        //If we don't have a new image
        } else {
            const data = {
                //...property: to get property and ubication into the same object
                ...property,//property, === property: property,
                ubication: center.value
            }
            //Pass the reference of the document and the data
            await updateDoc(docRef, data)
        }

        //Redirecting
        router.push({name: 'admin-properties'})
    })

</script>

<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="mt-5">
            <h1 class="text-h4 font-weight-bold">Edit property</h1>
        </v-card-title>
        <v-card-subtitle > 
            <p class="text-h5">Edit the property details</p>
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field
                v-model="title.value.value"
                :error-messages="title.errorMessage.value"
                label="Title"
                class="mb-5"
            ></v-text-field>

            <v-file-input
                v-model="image.value.value"
                :error-messages="image.errorMessage.value"
                accept="image/jpeg"
                prepend-icon="mdi-camera"
                label="Photography"
                class="mb-5"
                @change="uploadImage"
            ></v-file-input>

            <div class="my-5">
                <p class="font-weight-bold">Current image:</p>
                <img 
                    v-if="imagePreview"
                    class="w-50"
                    :src="imagePreview" 
                    alt=""
                />
                <img 
                    v-else
                    class="w-50"
                    :src="property?.image" 
                    alt=""
                />
            </div>


            <v-text-field
                v-model="price.value.value"
                :error-messages="price.errorMessage.value"
                label="Price"
                class="mb-5"
            ></v-text-field>

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Rooms"
                        class="mb-5"
                        :items="items"
                        v-model="rooms.value.value"
                        :error-messages="rooms.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="WC"
                        class="mb-5"
                        :items="items"
                        v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value"
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="4"
                >
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
                v-model="description.value.value"
                :error-messages="description.errorMessage.value"
                label="Description"
                class="mb-5"
            ></v-textarea>

            <v-checkbox 
                v-model="pool.value.value"
                label="Pool"
            ></v-checkbox>


            <h2 class="font-weight-bold text-center my-5">Location</h2>
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
                    Save changes
                </v-btn>
        </v-form>
    </v-card>
</template>