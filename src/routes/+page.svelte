<script>
    import user from '../user';
    import Login from '../lib/Login.svelte';

    $: isLoggedIn = $user === null? false : true;

    const logout = () => {
        user.update(val => val = null);
    }

</script>

<h1>INFILTR8</h1>
{#if isLoggedIn}
<h2>{$user.firstname} logged in!</h2>
<input type="button" value="Logout!" on:click={logout} />
{:else}
<h2>Login to INFILTR8</h2>
<Login />
{/if}

<style>
    :global(body) {
        background-color: #9e9e9e;
    }
    h1, h2 {
        color: #44f824;
        text-align: center;
    }
</style>