<template>
    <dialog id="settings_modal" class="modal">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <!--<input type="checkbox" value="light" class="toggle theme-controller" />-->
            <div class="flex flex-row justify-center">
                <a @click="signOut" class="link link-secondary">Log Out</a>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { supabase } from '../lib/supabaseClient'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

async function signOut() {
    await supabase.auth.signOut()
    router.push({ path: '/' })
}

</script>