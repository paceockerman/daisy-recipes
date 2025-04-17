<template>
    <div class="flex flex-col min-h-screen bg-base-200">
        <Navbar />
        <div class="container mx-auto py-0 flex justify-center flex-grow">
            <div class="min-w-1/2 bg-base-100 p-6 py-8">
                <div class="md:px-8 pt-4">
                    <h1 class="text-3xl font-bold text-primary mb-6 text-center">{{ recipe.title }}</h1>
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold text-secondary mb-3">Ingredients</h2>
                        <ul class="list-disc list-inside pl-4">
                            <li v-for="ingredient in recipe.ingredients" class="mb-1">
                                {{ ingredient }}
                            </li>
                        </ul>
                    </div>
                    <div class="divider pt-4"></div>
                    <div>
                        <h2 class="text-xl font-semibold text-secondary mb-3">Instructions</h2>
                        <ol class="list-decimal list-inside pl-4">
                            <li v-for="step in recipe.steps" class="mb-2">
                                {{ step }}
                            </li>
                        </ol>
                    </div>
                    <div class="divider pt-4"></div>
                    <div class="p-4 pb-2 text-xs opacity-60 tracking-wide">Not right?
                        <a class="link text-accent opacity-100 font-bold" @click="router.go(-1)">Go back to search
                            results</a> or <a class="link text-error opacity-100 font-bold"
                            onclick="delete_confirm_modal.showModal()">delete recipe</a>.
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        <dialog id="delete_confirm_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Confirm Delete</h3>
                <p class="py-4">Are you sure you want to delete the recipe "{{ recipe.title }}"?</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-sm">Cancel</button>
                    </form>
                    <button @click="deleteRecipe" class="btn btn-sm btn-error">Delete</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'

import { supabase } from '../lib/supabaseClient'

const recipe = ref([]);
const router = useRouter();
const route = useRoute();

async function getRecipe() {
    const { data } = await supabase.from('recipes').select().eq('id', route.query.id).limit(1).single()
    recipe.value = data
}


async function deleteRecipe() {
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.value?.id);

    if (error) {
        console.error("Error deleting recipe:", error);
    } else {
        router.go(-1);
    }

    // Close the confirmation modal
    delete_confirm_modal.close();
}

const confirmDelete = () => {
    delete_confirm_modal.showModal();
};

onMounted(() => { getRecipe() })

</script>