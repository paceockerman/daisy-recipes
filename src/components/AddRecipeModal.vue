<template>
    <dialog id="add_recipe_modal" class="modal">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <fieldset class="fieldset p-6">
                <label class="fieldset-label">Title</label>
                <input type="text" class="input input-bordered w-full" placeholder="Two-Ingredient Pancakes"
                    v-model="title" />

                <label class="fieldset-label">Ingredients</label>
                <textarea type="textarea" class="textarea textarea-bordered w-full h-40"
                    placeholder="1 ripe Banana&#10;2 Eggs&#10;Optional: Pinch of cinnamon" v-model="ingredients" />

                <label class="fieldset-label">Steps</label>
                <textarea type="textarea" class="textarea textarea-bordered w-full h-40"
                    placeholder="Mash the banana in a bowl.&#10;Whisk in the eggs (and cinnamon, if using).&#10;Cook spoonfuls on a lightly oiled pan until golden."
                    v-model="steps" />

                <button class="btn btn-accent mt-6 w-full" @click.prevent="submitRecipe">Submit Recipe</button>
            </fieldset>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { supabase } from '../lib/supabaseClient'
import { ref } from 'vue';

const title = ref('')
const ingredients = ref('')
const steps = ref('')

async function submitRecipe() {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session.user.id;

    const { error } = await supabase
        .from('recipes')
        .insert([{ title: title.value, ingredients: ingredients.value.split("\n"), steps: steps.value.split("\n"), user_id: userId }]);

    if (error) {
        console.log("oh no")
    }
    else {
        console.log("success!")
        add_recipe_modal.close()
    }
}

</script>