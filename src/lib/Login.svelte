<script>
    import user from '../user';
    import { navigateTo } from '../utils.js';
    import { addLog } from '$lib/logStore.js'; // Import the log store function

    let username = '';
    let password = '';
    let currentError = null;

    const login = () => {
    fetch('http://127.0.0.1:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                addLog(`User "${username}" logged in successfully.`);
                return response.json();
            } else if (response.status === 401) {
                currentError = 'Invalid username or password';
                addLog(`Failed login attempt for user "${username}". Error: ${currentError}`);
                return response.json();
            } else {
                currentError = 'Server response error, contact your administrator';
                addLog(`Failed login attempt for user "${username}". Error: ${currentError}`);
                return response.json();
            }
        })
        .then((data) => {
            if (data && data.user) {
                user.update((val) => (val = { ...data.user }));
                addLog(`User "${username}" is logged in, showing welcome screen.`);
                // Show the welcome message for 3 seconds, then navigate to the dashboard
                setTimeout(() => {
                    navigateTo('/dashboard'); // Redirect after a delay
                }, 3000); // 3000 milliseconds = 3 seconds
            }
        })
        .catch((error) => {
            currentError = error.message || 'An error occurred';
            addLog(`Error logging in for user "${username}". Details: ${currentError}`);
        });
};

</script>

<style>
</style>

<div class="flex justify-center items-center h-screen w-full bg-white dark:bg-gray-800">
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

        <button type="submit" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center block"> Login </button>

        <div class="mt-4 text-center">
            Don't have an account? <a href="/registration" class="text-blue-600 hover:underline">Register DAC Analyst</a>
        </div>
    </form>
</div>