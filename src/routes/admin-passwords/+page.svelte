<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { addLog } from '$lib/logStore.js';

	let username = '';
	let password = '';
	let confirmPassword = '';
	let adminPassword = '';
	let currentError = '';
	let successMessage = '';

    onMount(() => {
		// Retrieve username from query parameters
		const urlParams = new URLSearchParams(window.location.search);
		username = urlParams.get('username');
	});

    const goToAdmin = () => {
        addLog('Navigated back to admin homepage from password change page'); // Log navigation
        navigateTo('/admin-dashboard');
    };

	// Function to validate password based on STIG requirements
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

	async function updatePassword() {
		// Ensure all fields are provided
		if (!password || !confirmPassword || !adminPassword) {
			currentError = 'All fields are required.';
			return;
		}

		// Validate new password
		const validationError = validatePassword(password);
		if (validationError) {
			currentError = validationError;
			return;
		}

		// Ensure passwords match
		if (password !== confirmPassword) {
			currentError = 'Passwords do not match.';
			return;
		}

		try {
			// Send the request to the backend
			const response = await fetch('http://127.0.0.1:8080/admin-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,        
					password,        
					adminPassword,   
				}),
			});

			if (response.ok) {
				const result = await response.json();
                alert(`Password for ${username} successfully updated.`)
				currentError = '';
				addLog(`Password updated successfully for user ${username}`);
				goto('/admin-dashboard')
			} else {
				const data = await response.json();
				currentError = data.error || 'Failed to update the password.';
				successMessage = '';
			}
		} catch (error) {
			console.error('Error updating password:', error);
			currentError = 'An error occurred. Please try again.';
			successMessage = '';
		}
	}
</script>

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
	<form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={updatePassword}>
		<h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">
			Update Password for {username ? username : 'User'}
		</h2>
		
		{#if currentError}
			<div class="mb-4 text-red-600">{currentError}</div>
		{/if}
		
		{#if successMessage}
			<div class="mb-4 text-green-600">{successMessage}</div>
		{/if}
		
		<div class="mb-4">
			<label class="block text-gray-900 dark:text-white" for="password">New Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				placeholder="Enter New Password"
				class="mt-1 block w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<label class="block text-gray-900 dark:text-white" for="confirmPassword">Confirm New Password</label>
			<input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				placeholder="Re-Enter New Password"
				class="mt-1 block w-full p-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<label class="block text-gray-900 dark:text-white" for="adminPassword">Admin Password</label>
			<input
				type="password"
				id="adminPassword"
				bind:value={adminPassword}
				placeholder="Enter Admin Password"
				class="mt-1 block w-full p-2 border rounded"
			/>
		</div>

		<button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
			Update Password
		</button>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
			Back to Admin Homepage
		</button>
	</form>
</div>
