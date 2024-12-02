<script>
	import { onMount } from 'svelte';
	import Menu from '$lib/AdminMenu.svelte';
	import { addLog } from '$lib/logStore.js';
    import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	
	let greeting = '';
	let menuOpen = false;
	let analystUsers = [];
	let errorMessage = '';

	onMount(async () => {
		// Set greeting message
		const hours = new Date().getHours();
		greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
		addLog(`Greeting set to: ${greeting}`);
		
		// Fetch Analyst Users
		await fetchAnalystUsers();
	});

	async function fetchAnalystUsers() {
		try {
			const response = await fetch('http://127.0.0.1:8080/analyst-users');
			if (response.ok) {
				const data = await response.json();
				analystUsers = data.usernames;
			} else {
				errorMessage = "Failed to fetch analyst users.";
				addLog(`Error: ${errorMessage}`);
			}
		} catch (error) {
			errorMessage = "An error occurred while fetching data.";
			addLog(`Error: ${error}`);
		}
	}

	function handleChangePassword(username) {
	    addLog(`Initiating password change for: ${username}`);
	    goto(`/admin-passwords?username=${username}`); // Redirect to the password update page
    }
</script>

<Menu {menuOpen} />

<div class="py-6 text-center">
	<h1 class="text-2xl font-semibold dark:text-gray-200">{greeting}, Admin!</h1>
</div>

<div class="grid grid-cols-1 gap-6 p-6">
	<!-- Analyst Users Section -->
	<div class="projects">
		<div class="mb-4 rounded bg-gray-50 p-4 shadow dark:bg-gray-700">
			<h2 class="flex items-center text-xl font-bold dark:text-gray-200">
				<span class="material-symbols-outlined mr-2">folder</span>
				Analyst Users
			</h2>
		</div>
		<div class="rounded bg-white p-4 shadow dark:bg-gray-700">
			{#if errorMessage}
				<p class="text-red-500">{errorMessage}</p>
			{:else if analystUsers.length === 0}
				<p class="text-gray-500">No Analyst Users Available</p>
			{:else}
                <ul>
                    {#each analystUsers as user}
                        <li class="mb-4 flex items-center justify-between p-2 rounded border shadow-sm">
                            <span class="text-gray-700 dark:text-gray-200">{user}</span>
                            <button
                                class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                on:click={() => handleChangePassword(user)}
                            >
                                Change Password
                            </button>
                        </li>
                    {/each}
                </ul>
			{/if}
		</div>
	</div>
</div>
