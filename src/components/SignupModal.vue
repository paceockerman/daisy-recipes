<template>
    <dialog id="signup_modal" class="modal">
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

                <label class="label mt-4">
                    <span class="label-text">Confirm Password</span>
                </label>
                <input type="password" class="input input-bordered w-full" placeholder="Password"
                    v-model="confirmPassword" />

                <button class="btn btn-neutral mt-6 w-full" @click.prevent="handleSignup">Create Account</button>

                <p class="mt-4 text-center">
                    Already have an account?
                    <a onclick="signup_modal.close();login_modal.showModal();" class="link link-secondary">Log In
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
const confirmPassword = ref('');
const error = ref(null);

const handleSignup = async () => {
    if (password.value !== confirmPassword.value) {
        alert("passwords do not match!")
        return;
    }
    try {
        const { data, error: supabaseError } = await supabase.auth.signUp({
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
            console.log('Signed Up:', data);
            // Optionally redirect the user or close the modal
            signup_modal.close();
        }
    } catch (err) {
        error.value = err.message;
        console.error('Signup error:', err);
        // Optionally display the error to the user
        alert(error.value);
    }
};
</script>