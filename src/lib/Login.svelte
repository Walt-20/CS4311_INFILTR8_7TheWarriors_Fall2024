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

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={login}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Log In</h2>
        {#if currentError}
            <div class="mb-4 text-red-600">{currentError}</div>
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Username" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="password" id="password" bind:value={password} placeholder="Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>
        
        <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot Password?</a>

        <a href="/dashboard" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center block">Login</a>

        <div class="mt-4 text-center">
            Don't have an account? <a href="/registration" class="text-blue-600 hover:underline">Register DAC Analyst</a>
        </div>
    </form>
</div>

<!-- <div class="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
    <form class="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8" on:submit|preventDefault={login}>
        <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Log In</h2>
        {#if currentError}
            <div class="mb-4 text-red-600 dark:text-red-400">{currentError}</div>
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Username" class="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300" for="password">Password</label>
            <input type="password" id="password" bind:value={password} placeholder="Password" class="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
        </div>
        
        <a href="/forgot-password" class="text-blue-600 hover:underline dark:text-blue-400">Forgot Password?</a>

        <button type="submit" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">Login</button>

        <div class="mt-4 text-center">
            Don't have an account? <a href="/registration" class="text-blue-600 hover:underline dark:text-blue-400">Register DAC Analyst</a>
        </div>
    </form>
</div> -->