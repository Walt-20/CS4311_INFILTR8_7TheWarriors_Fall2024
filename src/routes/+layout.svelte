<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
</script>

<header class="relative flex justify-between items-center p-4 bg-white dark:bg-gray-800">
    <h1 class="text-lg font-semibold">INFILTR8</h1>
    <div class="absolute top-4 right-4 z-10">
        <DarkMode class="p-4 rounded bg-blue-500 text-white" />
    </div>
</header>
  
<div class="flex flex-col min-h-screen bg-white dark:bg-gray-800">
    <slot />
</div>
