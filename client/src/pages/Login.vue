<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <label for="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    v-model="email"
                    required
                />
            </div>
            <div>
                <label for="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    required
                />
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import * as authService from '../api/auth'
import { setUser } from '../store/modules/user'
import { router } from '../router/index.js'

export default {
    name: 'LoginPage',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login() {
            try {
                const credentials = {
                    email: this.email,
                    password: this.password
                }
                const user = await authService.login(credentials)
                setUser(this.$store, user)
                router.push({ name: 'Home' })
            }
            catch (error) {
                console.error(error)
            }
        }
    }
}
</script>

<style scoped>

</style>