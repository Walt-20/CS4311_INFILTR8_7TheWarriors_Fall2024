<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
	import { textSize } from '$lib/settingStore.js'; // Import the store
	import { browser } from '$app/environment';
	$: {
        if (browser) {
            console.log('Running in the browser:', $textSize);  // Log to check if it's running correctly
            if ($textSize) {
                document.documentElement.style.setProperty('--text-font-size', `${$textSize}px`);
            }
        } else {
            console.log('Not in the browser (SSR)');
        }
    }
</script>

<div class="relative flex min-h-screen flex-col bg-white dark:bg-gray-800">
	<!-- Dark Mode toggle button in the top-right corner -->
	<div class="absolute right-4 top-4 z-10">
		<DarkMode></DarkMode>
	</div>

	<!-- Slot for the rest of the content -->
	<slot></slot>
</div>
