<template>
    <dialog id="settings_modal" class="modal">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <!--<input type="checkbox" value="light" class="toggle theme-controller" />-->
            <div class="flex flex-col justify-center gap-4 mt-4">
                <button @click="exportAllRecipes" class="btn btn-primary">Export All Recipes</button>
                <a @click="signOut" class="btn btn-error">Log Out</a>
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
import { ref } from 'vue';
const router = useRouter();
const exporting = ref(false);

async function signOut() {
    await supabase.auth.signOut()
    router.push({ path: '/' })
}

async function exportAllRecipes() {
    exporting.value = true;
    try {
        const { data: recipes, error } = await supabase
            .from('recipes')
            .select('*'); // Fetch all columns

        if (error) {
            console.error('Error fetching recipes for export:', error);
            alert('Failed to export recipes.');
            return;
        }

        if (recipes && recipes.length > 0) {
            downloadRecipesAsJson(recipes);
        } else {
            alert('No recipes found to export.');
        }
    } finally {
        exporting.value = false;
    }
}

function downloadRecipesAsJson(recipes) {
    const jsonData = JSON.stringify(recipes, null, 2);
    const filename = 'all_recipes.json';
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

</script>