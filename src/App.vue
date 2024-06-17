<script setup>
  import { RouterView } from 'vue-router'
  // import { storeToRefs } from 'pinia'
  import { useAuthStore } from './stores/auth'

  const auth = useAuthStore()

  //We can make destructuring for an store by using storeToRefs (but be careful) we cannot use this when a 
  //state is modified by this variable, function, etc, because of lost reactivity
  // const { isAuth } = storeToRefs(auth)
</script>

<template>
    <v-card elevation="3" max-width="1200" class="mx-auto">
      <v-layout>

        <v-app-bar color="blue-darken-1">
          <template v-slot:prepend>
            <v-btn :to="{name: 'home'}">Real state - vuefire </v-btn>
          </template>

          <template v-slot:append>

            <div v-if="auth.isAuth">
              <v-btn :to="{name: 'admin-properties'}">Admin</v-btn>
              <v-btn @click="auth.logout">Log out</v-btn>
            </div>

            <div v-else>
              <v-btn :to="{name: 'home'}">Home</v-btn>
              <v-btn :to="{name: 'login'}">Log in</v-btn>
            </div>

          </template>
        </v-app-bar>

        <v-main>
          <v-container>
            <RouterView />
          </v-container>
        </v-main>

      </v-layout>
    </v-card>
</template>