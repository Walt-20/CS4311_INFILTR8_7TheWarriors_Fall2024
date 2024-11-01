<script>
    import user from '../user';
    import Login from '../lib/Login.svelte';
    import { navigateTo } from '../utils.js';

    $: isLoggedIn = $user === null ? false : true;
    
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-5xl font-bold mb-4 mt-16 text-black dark:text-white">INFILTR8</h1>
    {#if isLoggedIn}
        <h2 class="text-2xl mb-4 text-black dark:text-white">Welcome, {$user.first_name}!</h2>
    {:else}
        <Login />
    {/if}
</div>
