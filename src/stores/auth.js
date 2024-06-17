import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {

    const auth = useFirebaseAuth()

    //User auth state
    const authUser = ref(null)

    const router = useRouter()

    //Error state
    const errorMessage = ref('')

    //Errors dictionary
    const errorCodes = {
        'auth/invalid-credential' : 'Incorrect email or password'
    }

    onMounted(() => {
        //Changing the state of the user for authenticated
        onAuthStateChanged(auth, (user) => {
            if(user) {
                //If we have an authenticated user. Assign this user to change the value of the state authUser
                authUser.value = user
            }
        })
    })
    
    //Destructuring for values than we passed in LoginView.vue
    const login = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //Info of the authenticated user
                const user = userCredential.user
                //Get that info into the state value
                authUser.value = user

                //User redirected to 'admin-properties'
                router.push({name: 'admin-properties'})
            })
            .catch(error => {
                //The values of .[error.code] are 'auth/user-not-found' or 'auth/wrong-password'. Both are
                //search in the dictionary errorCodes
                errorMessage.value = errorCodes[error.code]
                //Assign the value of the error (if had an error) to the state (errorMessage)
            })
    }

    const logout = () => {
        signOut(auth).then(() => {
            //Changing the state of the auth user to null. And loging out
            authUser.value = null

            //User redirected to 'login'
            router.push({name: 'login'})
        }).catch(error => {
            console.log(error)
        })
    }

    const hasError = computed(() => {
        //If we have an error, this computed property returns true
        return errorMessage.value
    })

    const isAuth = computed(() => {
        //If we have an authenticated user, this computed property returns true
        return authUser.value
    }) 

    return {
        login,
        logout,
        hasError,
        errorMessage,
        isAuth
    }
}) 