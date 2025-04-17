<template>
    <div class="flex flex-col min-h-screen bg-base-200">
        <Navbar />
        <div class="container mx-auto py-0 flex justify-center flex-grow">
            <div class="min-w-1/2 bg-base-100 p-6 py-10">
                <div class="md:px-8 pt-4">
                    <h1 class="text-3xl font-bold text-primary mb-6 text-center">Search Results</h1>
                    <ul class="list bg-base-100 rounded-box shadow-md">

                        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Recipes that match your search for <span
                                class="text-secondary opacity-100 font-bold">{{
                                    searchQuery }}</span></li>

                        <li v-for="recipe in recipes" class="list-row">
                            <div>
                                <div class="size-10 mask mask-squircle bg-primary">
                                </div>
                            </div>
                            <div>
                                <div>{{ recipe.title }}</div>
                                <div class="text-xs uppercase font-semibold opacity-60">Recipe Subtitle</div>
                            </div>
                            <button @click="router.push({ path: 'recipe', query: { id: recipe.id } })"
                                class="btn btn-outline btn-accent">Go to Recipe</button>
                        </li>

                        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Didn't find your recipe? Search again or
                            <a onclick="add_recipe_modal.showModal()" class="link text-accent opacity-100 font-bold">add
                                a recipe.</a>
                        </li>

                    </ul>
                </div>

            </div>
        </div>
        <Footer />
        <AddRecipeModal />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import AddRecipeModal from '@/components/AddRecipeModal.vue';

import { supabase } from '../lib/supabaseClient'

const route = useRoute();
const router = useRouter()
const searchQuery = ref(route.query.q);
const recipes = ref([]);
const loading = ref(false);
const error = ref(null);

async function searchRecipes() {
    loading.value = true;
    error.value = null;
    recipes.value = [];
    searchQuery.value = route.query.q;

    if (searchQuery.value) {
        const keywords = Array.isArray(searchQuery.value)
            ? searchQuery.value.map(k => k.trim()).filter(k => k !== '')
            : searchQuery.value.split(/\s+/).map(k => k.trim()).filter(k => k !== '');

        if (keywords.length > 0) {

            const searchString = keywords.map(keyword => `'${keyword}'`).join(' | ');
            const { data, error: searchError } = await supabase.from('recipes').select().textSearch('title', searchString);

            if (searchError) {
                error.value = searchError;
            } else {
                recipes.value = data;
            }
        }
    }
    loading.value = false;
}

onMounted(() => { searchRecipes() })

watch(() => route.query.q, searchRecipes)

</script>