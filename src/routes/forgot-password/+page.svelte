<script>
    import { navigateTo } from '../../utils.js';
    import { addLog } from '$lib/logStore.js'; // Import log function

    let email = '';
    let token = '';
    let password = '';
    let confirmPassword = '';
    let currentError = null;
    

    const goToLogin = () => {
        navigateTo('../');
    };

    const updatePassword = () => {
        // Placeholder action for updating password
        addLog(`Password updated for user: ${username}`); // Log password update
        navigateTo('/'); // Navigate back to login
    };

    const backToLogin = () => {
        addLog('Navigated back to login from forgot password page'); // Log navigation
        navigateTo('/');
    };
</script>

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={token}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Change Password</h2>
        {#if currentError}
            <div class="mb-4 text-red-600">{currentError}</div>
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="email">DAC Analyst Email</label>
            <input type="text" id="email" bind:value={email} placeholder="Enter DAC Analyst Email" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="token">Token</label>
            <input type="text" id="token" bind:value={token} placeholder="Enter Token" class="mt-1 block w-full p-2 border rounded"/>
        </div>
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="text" id="password" bind:value={password} placeholder="Enter Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="confirmPassword">Re-Enter Password</label>
            <input type="text" id="confirmPassword" bind:value={confirmPassword} placeholder="Re-Enter Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
            Update Password
        </button>

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
            Back to Login
        </button>
    </form>
</div>
