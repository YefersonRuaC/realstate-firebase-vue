//Validation schema of our loginView (our validation rules)
export const loginSchema = {
    //This email is already linked with the input (text-field) through the useForm() and useField()
    email(value) {
        if (!value) {
          return 'This field is required';
        }
        // si es un email válido
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!regex.test(value)) {
          return 'Invalid email';
        }
        return true;
    },
    password(value) {
        if (value) return true
        return 'Password is required'
    }
}