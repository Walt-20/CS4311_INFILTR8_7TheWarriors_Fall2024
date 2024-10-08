<script>
    import user from '../user';
    import Login from '../lib/Login.svelte';

    $: isLoggedIn = $user === null? false : true;

    const logout = () => {
        user.update(val => val = null);
    }

</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">INFILTR8</h1>
    {#if isLoggedIn}
        <h2 class="text-2xl mb-4">Welcome, {$user.firstname}!</h2>
        <button on:click={logout} class="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
            Logout
        </button>
    {:else}
        <h2 class="text-2xl mb-4">Login to INFILTR8</h2>
        <Login />
    {/if}
</div>

<!-- <style>
    :global(body) {
        background-color: white;
    }
</style> -->