<template>

    <div v-if="hasSession">
        <div class="flex flex-col min-h-screen">
            <Navbar />
            <div class="hero bg-base-200 flex-grow">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-5xl font-bold text-primary">Welcome, {{ capitalize(username) }}.</h1>
                        <p class="py-6">
                            Quickly search for your recipes using the bar above, or add a new recipe using the button
                            below!
                        </p>
                        <button class="btn btn-xl btn-accent" onclick="add_recipe_modal.showModal()">Add Recipe</button>
                    </div>
                </div>
            </div>
            <FooterView />
        </div>
    </div>
    <div v-else>
        <div class="flex flex-col min-h-screen">
            <div class="hero bg-base-200 flex-grow">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-5xl font-bold text-primary">Daisy Recipes</h1>
                        <p class="py-6">
                            Easily store, organize, and find all your favorite personal recipes
                            in one convenient place. Keep your treasured dishes safe and accessible whenever you're
                            ready to
                            cook.
                        </p>
                        <button class="btn btn-xl btn-primary" onclick="signup_modal.showModal()">Get Started</button>
                    </div>
                </div>
            </div>
            <FooterView />
        </div>
    </div>
    <LoginModal />
    <SignupModal />
    <AddRecipeModal />
</template>

<script setup>
import LoginModal from '../components/LoginModal.vue';
import SignupModal from '../components/SignupModal.vue';
import FooterView from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import AddRecipeModal from '@/components/AddRecipeModal.vue';
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient'

const hasSession = ref(false)
const username = ref('')

supabase.auth.getSession().then(({ data: { session } }) => {
    hasSession.value = session !== null
    if (session) {
        username.value = session.user.email.split('@')[0];
    }
})

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        hasSession.value = false;
    }
    if (event === 'SIGNED_IN') {
        hasSession.value = true;
        username.value = session.user.email.split('@')[0];
    }
})

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


</script>