import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/property/:id',
      name: 'property',
      component: () => import('../views/PropertyView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      //This is a nested route. Everything that belongs to admin, is gonna share this layout (AdminLayout.vue)
      component: () => import('../views/admin/AdminLayout.vue'),
      //Route metafield to protect routes
      //If the parent has requiresAuth, it's is applies for their children
      meta: { requiresAuth: true },
      //Nested routes from AdminLayout.vue (admin group)
      children: [
        {
          path: 'properties',//The children path takes reference from his parent path
          name: 'admin-properties',//So, path: '/admin/properties' === path: 'properties'
          component: () => import('../views/admin/AdminView.vue'),
          // meta: { requiresAuth: true },
        },
        {
          path: 'new',
          name: 'new-property',
          component: () => import('../views/admin/NewPropertyView.vue'),
          // meta: { requiresAuth: true },
        },
        {
          path: 'edit/:id',
          name: 'edit-property',
          component: () => import('../views/admin/EditPropertyView.vue'),
          // meta: { requiresAuth: true },
        }
      ]
    }
  ]
})

//Navigation GUARD
router.beforeEach( async(to, from, next) => {//beforeEach is always ejecuted before of visite an url 
  //.some is gonna check that at least one of the elements in the array fullfil the condition (returns true)
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)

  //Check if the user is authenticated
  if(requiresAuth) {
    //If the session of that user already exits
    //resolve executes try. reject executes catch
    try {
      await authenticateUser()
      next()

    } catch (error) {
      console.log(error)
      //If the user is not authenticated, redirect him to 'login
      next({name: 'login'})
    }

  } else {
    //Routes without requiresAuth. So, we show those views
    next()
  }
  //to: is where we gonna go
  //from: is where we are already
  //next(): send to the next middleware
})

function authenticateUser() {

  const auth = useFirebaseAuth()

  //Returning the promise
  //resolve: when the promise is fullfied (condition fulffied) in this case if the user is authenticated
  //reject: when the promise is not fulldied, in this case if the user is not authenticated
  return new Promise((resolve, reject) => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //ubsubscribe: is an observer, this is use when we are interested in check state changes in our app
      //An observer notifies us when something change
      unsubscribe()//In this case ubsubscribe make only one call to onAuthStateChanged and then don't hear
      //changes in onAuthStateChanged (only is executed one time)

      if(user) {
        //Resolve the promise
        resolve()
      } else {
        //Reject the promise
        reject()
      }
    })

  })
}

export default router
