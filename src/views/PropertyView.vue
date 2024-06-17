<script setup>
    import { watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { doc } from 'firebase/firestore'
    import { useDocument, useFirestore } from 'vuefire'
    import { propertyPrice } from '@/helpers'
    import useLocationMap from '@/composables/useLocationMap'
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"

    const { zoom, center } = useLocationMap()
    const route = useRoute()
    const db = useFirestore()
    const docRef = doc(db, 'properties', route.params.id)
    const property = useDocument(docRef)

    watch(property, (property) => {
        center.value = property.ubication
    })
</script>

<template>
    <v-card flat>
        <v-card-title class="text-h4 text-center py-3 font-weight-bold">
            {{ property?.title }}
        </v-card-title>
        <v-img :src="property?.image" height="550" cover />

        <div class="bg-blue-grey-lighten-5 d-flex flex-column flex-md-row align-center">
            <v-card-text>
                Price:
                <span class="font-weight-bold">{{ propertyPrice(property?.price) }}</span>
            </v-card-text>
            <v-card-text>
                Bathrooms:
                <span class="font-weight-bold">{{ property?.wc }}</span>
            </v-card-text>
            <v-card-text>
                Parking slots:
                <span class="font-weight-bold">{{ property?.parking }}</span>
            </v-card-text>
            <v-card-text>
                Rooms:
                <span class="font-weight-bold">{{ property?.rooms }}</span>
            </v-card-text>
        </div>

        <v-row>
            <v-col
                cols="12"
                md="6"
            >
                <div class="text-pre-wrap mt-7 mb-3 ml-1">
                    {{ property?.description }}
                </div>
            </v-col>
            <v-col
                cols="12"
                md="6"
            >
                <div class=" mt-7 mb-3" style="height:400px">
                    <LMap 
                        v-model:zoom="zoom" 
                        :center="center" 
                        :use-global-leaflet="false"
                    >
                        <LMarker 
                            :lat-lng="center"
                        >
                            <LPopup>
                                {{ property?.title }}
                            </LPopup>
                        </LMarker>
                        <LTileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<style>
    .text-pre-wrap {
        white-space: pre-wrap;
    }
</style>