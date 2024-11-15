<script>
	import '../app.css';
	import { DarkMode } from 'flowbite-svelte';
	import { Notification } from '$lib/Notification.svelte'
</script>

<div class="relative flex min-h-screen flex-col bg-white dark:bg-gray-800">
	<!-- Dark Mode toggle button in the top-right corner -->
	<div class="absolute right-4 top-4 z-10">
		<DarkMode></DarkMode>
	</div>

	<!-- Slot for the rest of the content -->
	<slot></slot>
</div>
