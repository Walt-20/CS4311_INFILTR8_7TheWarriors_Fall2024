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
        const params = new URLSearchParams(window.location.search);
        username = params.get('username') || ''; 

        if (username === 'admin') {
            addLog('Admin password reset page loaded.');
        } else if (!username) {
            currentError = 'Username is missing. Please go back and try again.';
        }
    });

    const goToAdmin = () => {
    	addLog('Navigated back to admin homepage from password change page'); 
    	navigateTo('/admin-dashboard'); 
	};

	const validatePassword = (password) => {
		const minLength = 15;
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (password.length < minLength) {
			return `Password must be at least ${minLength} characters long.`;
		}
		if (!hasUppercase) {
			return 'Password must contain at least one uppercase letter.';
		}
		if (!hasLowercase) {
			return 'Password must contain at least one lowercase letter.';
		}
		if (!hasNumber) {
			return 'Password must contain at least one digit.';
		}
		if (!hasSpecialChar) {
			return 'Password must contain at least one special character.';
		}
		return '';
	};

    const updatePassword = () => {
        if (!username) {
            currentError = 'Invalid user.';
            return;
        }

        const validationError = validatePassword(password);
        if (validationError) {
            currentError = validationError;
            return;
        }

        if (password !== confirmPassword) {
            currentError = "Passwords do not match";
            return;
        }

        fetch('http://127.0.0.1:8080/update-admin-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
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
                alert("Password updated successfully!")
                addLog(`Password updated for user: ${username}`);

                navigateTo('/admin-dashboard'); 
            }
        })
        .catch((error) => {
            currentError = 'An error occurred. Please try again.';
            successMessage = null;
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
            <div class="mb-4 text-green-600">{successMessage}</div> 
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

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToAdmin}>
            Back to Admin Dashboard
        </button>
    </form>
</div>
