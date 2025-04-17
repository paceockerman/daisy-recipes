<template>
    <dialog id="login_modal" class="modal">
        <div class="modal-box p-0">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <fieldset class="fieldset p-6">
                <label class="label">
                    <span class="label-text">Email</span>
                </label>
                <input type="email" class="input input-bordered w-full" placeholder="Email" v-model="email" />

                <label class="label mt-4">
                    <span class="label-text">Password</span>
                </label>
                <input type="password" class="input input-bordered w-full" placeholder="Password" v-model="password" />
                <div class="mt-2 text-left">
                    <a href="#" class="link link-primary">Forgot Password?</a>
                </div>
                <button class="btn btn-neutral mt-6 w-full" @click.prevent="handleLogin">Log In</button>

                <p class="mt-4 text-center">
                    Don't have an account?
                    <a onclick="login_modal.close();signup_modal.showModal();" class="link link-secondary">Sign up
                        instead</a>
                </p>
            </fieldset>
        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';

const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
    try {
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });

        if (supabaseError) {
            error.value = supabaseError.message;
            console.error('Login error:', supabaseError);
            // Optionally display the error to the user
            alert(error.value);
        } else {
            // User logged in successfully
            console.log('Logged in:', data);
            // Optionally redirect the user or close the modal
            login_modal.close();
        }
    } catch (err) {
        error.value = err.message;
        console.error('Login error:', err);
        // Optionally display the error to the user
        alert(error.value);
    }
};
</script>