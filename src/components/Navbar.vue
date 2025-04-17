<template>
    <div class="navbar bg-base-100 shadow-sm flex justify-between items-center z-2">
        <a class="btn btn-ghost text-xl" @click="router.push({ path: '/' });">Daisy</a>
        <label class="input max-w-md w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder="Search for a recipe..." v-model="searchQueryBar"
                @keyup.enter="handleSearch" />
        </label>
        <button class="btn btn-ghost h-full w-12 aspect-square p-0" onclick="settings_modal.showModal()">
            <svg v-html="GearSvg" class="w-8 h-8 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            </svg>
        </button>
    </div>
    <SettingsModal />
</template>

<script setup>
import GearSvg from '../assets/gear.svg?raw';
import SettingsModal from './SettingsModal.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const searchQueryBar = ref('');

const handleSearch = () => {
    if (searchQueryBar.value) {
        router.push({ path: '/search', query: { q: searchQueryBar.value } });
        searchQueryBar.value = ''
    }
};
</script>
