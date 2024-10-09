<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="relative flex flex-col min-h-screen bg-white dark:bg-gray-800">
    
    <!-- Dark Mode toggle button in the top-right corner -->
    <div class="absolute top-4 right-4 z-10">
        <!-- <DarkMode class="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-full" /> -->
        <DarkMode />
    </div>

    <!-- Slot for the rest of the content -->
    <slot />
</div>