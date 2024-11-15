<script>
	import '../app.css';
	// import { DarkMode } from 'flowbite-svelte';
	import { textSize } from '$lib/settingStore.js'; // Import the store
	import { colorBlindMode } from '$lib/settingStore.js'; // Import the store
	import { browser } from '$app/environment';
	$: {
		if (browser) {
			// Update font size globally
			document.documentElement.style.setProperty('--text-font-size', `${$textSize}px`);
			
			// Update color-blind mode class globally
			if ($colorBlindMode) {
				document.documentElement.classList.add('color-blind-mode');
			} else {
				document.documentElement.classList.remove('color-blind-mode');
			}
		}
	}
</script>

<!-- In case we want to revert to where the light/dark mode is in the top right of each page, bring these lines back! - Adrian -->

<!-- <div class="relative flex min-h-screen flex-col bg-white dark:bg-gray-800"> -->
	<!-- Dark Mode toggle button in the top-right corner -->
	<!-- <div class="absolute right-4 top-4 z-10"> -->
		<!-- <DarkMode></DarkMode> -->
	<!-- </div> -->

	<!-- Slot for the rest of the content -->
	<slot></slot>
<!-- </div> -->
