<script>
    import user from '../user';
    import Login from '../lib/Login.svelte';

    $: isLoggedIn = $user === null ? false : true;

    // Log the login 
    $: {
        if (isLoggedIn) {
            console.log("Analyst is logged in:", $user.firstname);
        } else {
            console.log("Analyst is logged out");
        }
    }

    const logout = () => {
        console.log("Logging out Analyst...");
        user.update(val => {
            console.log("User before logout:", val);
            return null;
        });
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
