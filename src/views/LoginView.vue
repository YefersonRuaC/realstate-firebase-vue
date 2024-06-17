<script setup>
    import { useForm, useField } from 'vee-validate'
    import { loginSchema as validationSchema } from '../validation/loginSchema'
    import { useAuthStore } from '../stores/auth'

    //useForm will have the method to send the submit of the form and recover all the data of the fields
    //(useField) in the form of an object
    const { handleSubmit } = useForm({ validationSchema })//validationSchema is own of useForm()
    //and then we passed our schema of validation. But we can give an alias to loginSchema and then we have
    //validationSchema : validationSchema. So, if we have two variables with the same name, we only need to
    //pass one variable

    //No destructuring for stores
    const auth = useAuthStore()

    //useField we permitted have a validation above each one of these fields (show errors)
    const email = useField('email')//This useField are not only a ref(), they are an object with
    const password = useField('password')//a lot of info in groups that can gelp us to give
    // console.log(email) ////manage to all our form fields

    //values are the info that email and password fields have
    const submit = handleSubmit((values) => {

        auth.login(values)
    })
</script>

<template>
    <v-card
        flat
        max-width="600"
        class="mx-auto mb-10 mt-5"
    >
        <v-card-title
            class="text-h4 font-weight-bold"
        >
            Log In
        </v-card-title>
        <v-card-subtitle
            class="text-h5"
        >
            Log in with your account
        </v-card-subtitle>

        <v-alert
            v-if="auth.hasError"
            type="error"
            class="my-4"
            :title="auth.errorMessage"
        ></v-alert>

        <v-form class="mt-5">
            <!-- We link useField() of vee-validate with the input v-model="email.value.value" -->
            <v-text-field 
                type="email"
                label="Email"
                bg-color="blue-grey-lighten-5"
                class="mb-2"
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
            />
            <v-text-field 
                type="password"
                label="Password"
                bg-color="blue-grey-lighten-5"
                class="mb-2"
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
            />

            <v-btn
                block
                color="pink-accent-3"
                @click="submit"
            >
                Log in
            </v-btn>
        </v-form>
    </v-card>
</template>