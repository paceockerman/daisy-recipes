<template>
    <div class="flex flex-col min-h-screen bg-base-200">
        <Navbar />
        <div class="container mx-auto py-0 flex justify-center flex-grow">
            <div class="min-w-1/2 bg-base-100 p-6 py-8">
                <div class="md:px-12 pt-4">
                    <div class="flex justify-center items-center mb-6">
                        <div class="flex-1"></div>
                        <h1 class="text-3xl font-bold text-primary text-center" v-if="!isEditing">{{ recipe.title
                            }}
                        </h1>
                        <input v-else type="text" v-model="editedRecipe.title" placeholder="Recipe Title"
                            class="input input-bordered w-full text-3xl font-bold text-primary text-center" />
                        <div class="flex-1 flex items-left" v-if="!isEditing">
                            <button @click="toggleEditMode" class="btn btn-sm ml-auto" v-if="!isEditing">Edit</button>
                        </div>
                        <div v-else class="flex gap-2">
                            <button @click="saveRecipe" class="btn btn-sm btn-primary">Save</button>
                            <button @click="cancelEdit" class="btn btn-sm">Cancel</button>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h2 class="text-xl font-semibold text-secondary mb-3">Ingredients</h2>
                        <ul v-if="!isEditing" class="list-disc list-inside pl-4">
                            <li v-for="ingredient in recipe.ingredients" :key="ingredient" class="mb-1">
                                {{ ingredient }}
                            </li>
                        </ul>
                        <div v-else>
                            <textarea v-model="editedRecipe.ingredientsText"
                                placeholder="Enter ingredients, each on a new line"
                                class="textarea textarea-bordered w-full h-40"></textarea>
                        </div>
                    </div>

                    <div class="divider pt-4"></div>

                    <div>
                        <h2 class="text-xl font-semibold text-secondary mb-3">Instructions</h2>
                        <ol v-if="!isEditing" class="list-decimal list-inside pl-4">
                            <li v-for="(step, index) in recipe.steps" :key="index" class="mb-2">
                                {{ step }}
                            </li>
                        </ol>
                        <div v-else>
                            <textarea v-model="editedRecipe.stepsText"
                                placeholder="Enter instructions, each step on a new line"
                                class="textarea textarea-bordered w-full h-60"></textarea>
                        </div>
                    </div>

                    <div class="divider pt-4"></div>

                    <div class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Not right?
                        <a class="link text-accent opacity-100 font-bold" @click="router.go(-1)">Go back to search
                            results</a> or
                        <a class="link text-error opacity-100 font-bold"
                            onclick="delete_confirm_modal.showModal()">delete
                            recipe</a>.
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
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter, useRoute } from "vue-router";
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'

import { supabase } from '../lib/supabaseClient'

const recipe = ref({});
const editedRecipe = reactive({
    title: '',
    ingredientsText: '',
    stepsText: '',
});
const isEditing = ref(false);
const router = useRouter();
const route = useRoute();

async function getRecipe() {
    const { data } = await supabase.from('recipes').select().eq('id', route.query.id).limit(1).single()
    if (data) {
        recipe.value = data;
        editedRecipe.title = data.title;
        editedRecipe.ingredientsText = data.ingredients.join('\n');
        editedRecipe.stepsText = data.steps.join('\n');
    }
}

const toggleEditMode = () => {
    isEditing.value = !isEditing.value;
};

const cancelEdit = () => {
    isEditing.value = false;
    editedRecipe.title = recipe.value.title;
    editedRecipe.ingredientsText = recipe.value.ingredients.join('\n');
    editedRecipe.stepsText = recipe.value.steps.join('\n');
};

const saveRecipe = async () => {
    const updatedIngredients = editedRecipe.ingredientsText.split('\n').map(item => item.trim()).filter(item => item !== '');
    const updatedSteps = editedRecipe.stepsText.split('\n').map(item => item.trim()).filter(item => item !== '');

    const { data, error } = await supabase
        .from('recipes')
        .update({
            title: editedRecipe.title,
            ingredients: updatedIngredients,
            steps: updatedSteps,
        })
        .eq('id', recipe.value.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating recipe:", error);
        alert("Failed to update recipe.");
    } else if (data) {
        console.log("Recipe updated successfully:", data);
        recipe.value = data;
        isEditing.value = false;
        alert("Recipe updated!");
    }
};

async function deleteRecipe() {
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.value?.id);

    if (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe.");
    } else {
        alert("Recipe deleted successfully!");
        router.go(-1);
    }

    delete_confirm_modal.close();
}

const confirmDelete = () => {
    delete_confirm_modal.showModal();
};

onMounted(() => { getRecipe() })

</script>