<script>
    import { navigateTo } from '../../utils.js';
    import { addLog } from '$lib/logStore.js'; // Import log function

    let username = '';
    let token = '';
    let currentError = null;
    

    const goToLogin = () => {
        addLog('Navigated back to login from forgot password page'); // Log navigation
        navigateTo('/login');
    };

    const verifyToken = () => {
    fetch('http://127.0.0.1:8080/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            token: token
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            currentError = data.error;
            addLog(`Failed token verification for user: ${username}. Error: ${currentError}`);
        } else {
            addLog(`Token verified for user: ${username}`);
            // Navigate to the update-password page, passing the username as a query parameter
            navigateTo(`/update-password?username=${username}`);
        }
    })
    .catch((error) => {
        currentError = 'An error occurred. Please try again.';
        addLog(`Error verifying token for user: ${username}. Details: ${error}`);
    });
};

</script>

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={verifyToken}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Enter Token</h2>
        {#if currentError}
            <div class="mb-4 text-red-600">{currentError}</div>
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Enter Username" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="token">Token</label>
            <input type="text" id="token" bind:value={token} placeholder="Enter Token" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
            Continue
        </button>

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
            Back to Login
        </button>
    </form>
</div>
