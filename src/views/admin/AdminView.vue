<script setup>
    import useProperties from '@/composables/useProperties'
    import { propertyPrice } from '@/helpers'

    const { propertiesCollection, deleteItem } = useProperties()
</script>

<template>
    <h2 class="text-center text-h3 my-5 font-weight-bold">Admin panel</h2>
    <v-btn
        color="blue ml-4"
        variant="flat"
        :to="{name: 'new-property'}"
    >
        New property
    </v-btn>

    <v-card class="mx-auto mt-5" flat>
        <v-list>
            <v-list-item
                v-for="property in propertiesCollection"
                :key="property.id"
            >
                <template v-slot:prepend>
                    <v-list-item-media class="mr-2">
                        <img width="180" :src="property.image" />
                    </v-list-item-media>
                </template>

                <v-list-item-title>{{ property.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ propertyPrice(property.price) }}</v-list-item-subtitle>
                
                <template v-slot:append>
                    <v-btn 
                        color="info" 
                        flat 
                        class="mr-2"
                        :to="{name: 'edit-property', params: { id:property.id } }"
                    >
                        Edit
                    </v-btn>
                    <v-btn 
                        color="red-darken-3" 
                        flat
                        @click="deleteItem(property.id, property.image)"
                    >
                        Delete
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>