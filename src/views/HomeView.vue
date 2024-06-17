<script setup>
  import useProperties from '@/composables/useProperties'//useProperties has an export default, we cannot use {}
  import Property from '@/components/Property.vue'
  import { propertyPrice } from '@/helpers'

  const { pool, filteredItems} = useProperties()

</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold mt-3">Our properties</h1>

  <v-card flat>
    <v-card-title class="text-h5">
      Search
      <v-checkbox 
        label="Pool"  
        v-model="pool"
      />
    </v-card-title>

    <v-row>
      <Property
        v-for="property in filteredItems"
        :key="property.id"
        :property="property"
        :price="propertyPrice"
      />
    </v-row>

  </v-card>
</template>