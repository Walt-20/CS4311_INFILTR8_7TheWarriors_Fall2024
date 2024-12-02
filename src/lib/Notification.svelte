<!-- src/lib/Notification.svelte -->
<script>
    export let message;
    export let unread = false;
</script>

<div class="notification flex items-center p-4 mb-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg bg-white dark:bg-gray-800">
    <div class="notification-message flex-grow text-gray-800 dark:text-gray-200">
        {message}
    </div>
    {#if unread}
        <div class="ml-4 h-3 w-3 rounded-full bg-red-500"></div>
    {/if}
</div>

<style>
    /* You can remove the custom CSS if you are using Tailwind CSS for styling */
</style>