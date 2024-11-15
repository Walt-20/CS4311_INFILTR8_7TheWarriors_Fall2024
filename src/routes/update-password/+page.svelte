<script>
    import { onMount } from 'svelte'; // Import onMount to run code when the component loads
    import { navigateTo } from '../../utils.js';
    import { addLog } from '$lib/logStore.js'; // Import log function

    let username = '';
    let password = '';
    let confirmPassword = '';
    let currentError = null;
    let successMessage = null; // New variable to store the success message

    onMount(() => {
        // Get the username from the query parameters in the URL
        const params = new URLSearchParams(window.location.search);
        username = params.get('username') || ''; 

        if (!username) {
            currentError = 'Username is missing. Please go back and try again.';
        }
    });

    const goToLogin = () => {
        addLog('Navigated back to login from password change page'); // Log navigation
        navigateTo('../');
    };

    const updatePassword = () => {
        if (password !== confirmPassword) {
            currentError = "Passwords do not match";
            return;
        }

        fetch('http://127.0.0.1:8080/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                currentError = data.error;
                successMessage = null;
                addLog(`Failed to update password for user: ${username}. Error: ${currentError}`);
            } else {
                currentError = null; 
                successMessage = "Password updated successfully!"; 
                addLog(`Password updated for user: ${username}`);
                
                // Wait for 3 seconds before redirecting to login page
                setTimeout(() => {
                    navigateTo('/'); 
                }, 3000); 
            }
        })
        .catch((error) => {
            currentError = 'An error occurred. Please try again.';
            successMessage = null; // Reset success message on error
            addLog(`Error updating password for user: ${username}. Details: ${error}`);
        });
    };
</script>

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={updatePassword}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Update Password for {username ? username : 'User'}</h2>
        
        {#if currentError}
            <div class="mb-4 text-red-600">{currentError}</div>
        {/if}
        
        {#if successMessage}
            <div class="mb-4 text-green-600">{successMessage}</div> <!-- Success message displayed here -->
        {/if}
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="password" id="password" bind:value={password} placeholder="Enter Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="confirmPassword">Re-Enter Password</label>
            <input type="password" id="confirmPassword" bind:value={confirmPassword} placeholder="Re-Enter Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
            Update Password
        </button>

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
            Back to Login
        </button>
    </form>
</div>
