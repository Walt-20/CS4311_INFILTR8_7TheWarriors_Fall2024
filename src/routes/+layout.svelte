<script>
    import { DarkMode } from 'flowbite-svelte';
    import Notification from '$lib/Notification.svelte';
    import { notifications } from '$lib/notificationStore.js';
    import { BellSolid } from 'flowbite-svelte-icons';

    let showNotificationList = false;
    let notificationsArray = [];

    // Subscribe to the notifications store
    $: notificationsArray = $notifications;

    function toggleNotifications() {
        showNotificationList = !showNotificationList;

        if (!showNotificationList) {
            notifications.update(n =>
                n.map(notification => ({ ...notification, unread: false }))
            );
        }
    }

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

<div class="relative flex min-h-screen flex-col bg-white dark:bg-gray-800">
    <!-- Dark Mode toggle button in the top-right corner -->
    <div class="absolute right-4 top-4 z-10 flex items-center space-x-4">
        <!-- Notification Icon -->
        <button on:click={toggleNotifications} class="relative">
            <span class="material-icons text-gray-800 dark:text-gray-200"><BellSolid class="w-5 h-5" /></span>
            {#if notificationsArray.some(n => n.unread)}
                <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            {/if}
        </button>
        <DarkMode></DarkMode>
    </div>

    <!-- Notification List -->
    {#if showNotificationList}
        <div class="absolute right-4 top-16 z-20 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            {#each notificationsArray as notification}
                <Notification message={notification.message} unread={notification.unread}></Notification>
            {/each}
        </div>
    {/if}

    <!-- Slot for the rest of the content -->
    <slot></slot>
</div>

<style>
    .material-icons {
        font-size: 24px;
        cursor: pointer;
    }
</style>
	

<!-- In case we want to revert to where the light/dark mode is in the top right of each page, bring these lines back! - Adrian -->

<!-- <div class="relative flex min-h-screen flex-col bg-white dark:bg-gray-800"> -->
	<!-- Dark Mode toggle button in the top-right corner -->
	<!-- <div class="absolute right-4 top-4 z-10"> -->
		<!-- <DarkMode></DarkMode> -->
	<!-- </div> -->

	<!-- Slot for the rest of the content -->
	<!-- <slot></slot> -->
<!-- </div> -->

