<script>
    import user from '../user';
    import {navigateTo} from '../utils.js';

    let username = '';
    let password = '';
    let currentError = null;

    const login = () => {
        fetch('http://127.0.0.1:3030/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then((response) => {
            if (response.status < 299) {
                return response.json();
            } 

            if (response.status > 299) {
                currentError = 'Server response error, contact your administrator';
            }
        })
        .then((data) => {
            if (data) {
                user.update(val => val = {...data});
            }
        })
        .catch((error) => {
            currentError = error;
            console.log("Error loggin in: ", error);
        })
    }
</script>

<style>
</style>

<div class="flex justify-center items-center h-screen bg-gray-100">
    <form class="max-w-md w-full bg-white shadow-md rounded-lg p-8" on:submit|preventDefault={login}>
        <h2 class="text-2xl font-semibold text-center mb-6">Log In</h2>
        {#if currentError}
            <div class="mb-4 text-red-600">{currentError}</div>
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-700" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Username" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700" for="password">Password</label>
            <input type="password" id="password" bind:value={password} placeholder="Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>
        
        <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot Password?</a>

        <a href="/dashboard" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center block">Login</a>

        <div class="mt-4 text-center">
            Don't have an account? <a href="/registration" class="text-blue-600 hover:underline">Register DAC Analyst</a>
        </div>
    </form>
</div>