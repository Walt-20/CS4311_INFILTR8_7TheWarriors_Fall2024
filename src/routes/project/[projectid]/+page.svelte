<script>
	import Menu from '../../../lib/Menu.svelte';
	import { navigateTo } from '../../../utils';
	import { disallowedIps, disallowedEntryPoints } from '../../../disallowedfilter';
	import user from '../../../user';
	import { addLog } from '$lib/logStore.js';
	import { notifications } from '$lib/notificationStore.js';

	const userId = $user.username;
	export let data;

	let projectname = data.projectid;

	let newIp = ''; // Stores the input for new IP
	let errorMessage = ''; // To store and display error messages

	let ips = [];
	//let disallowedIps = [];
	let ipStatus = [];

	let entryPoints = [];
	let entryPointStatus = [];
	//let disallowedEntryPoints = [];

	let menuOpen = false;

	let severity = [];

	let pluginName = [];

	// Toggle IP status between 'allowed' and 'off-limits'
	function toggleIpStatus(index) {
		ipStatus[index] = ipStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
		console.log(ipStatus[index]);
		if (ipStatus[index] == 'Off-Limits') {
			console.log('off-limits');

			disallowedIps.update((currentIps) => {
				return [...currentIps, ips[index]];
			});

			console.log(disallowedIps);
		} else {
			disallowedIps.update((currentIps) => {
				return currentIps.filter((ip) => ip !== ips[index]);
			});
		}
	}

	// Toggle EntryPoint status between 'allowed' and 'off-limits'
	function toggleEntryPointStatus(index) {
		entryPointStatus[index] = entryPointStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
		console.log(entryPointStatus[index]);
		if (entryPointStatus[index] == 'Off-Limits') {
			console.log('off-limits');

			disallowedEntryPoints.update((currentEntryPoints) => {
				return [...currentEntryPoints, entryPoints[index]];
			});

			console.log(disallowedEntryPoints);
		} else {
			disallowedEntryPoints.update((currentEntryPoints) => {
				return currentEntryPoints.filter((entry) => entry !== entryPoints[index]);
			});
		}
	}

	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		const validFiles = selectedFiles.filter((file) => file.name.endsWith('.txt'));

		if (validFiles.length !== selectedFiles.length) {
			alert('Only .txt files are allowed.');
			console.log('Invalid file type selected.');
		}

		validFiles.forEach((file) => addIpsFromFile(file));
	}

	function addIpsFromFile(file) {
		const reader = new FileReader();

		reader.onload = () => {
			const content = reader.result;

			const lines = content.split(/\s+/);

			const validIps = lines.filter((ip) => isValidIp(ip) && !ips.includes(ip));

			if (validIps.length > 0) {
				ips = [...ips, ...validIps];
				ipStatus = [...ipStatus, ...validIps.map(() => 'Allowed')]; // Default status for new IPs
				console.log('Added IPs:', validIps);
			} else {
				console.log('No valid IPs found in the file or all IPs are already in the list.');
			}
		};

		// Handle file reading errors
		reader.onerror = () => {
			console.error('Error reading file:', reader.error);
		};

		// Start reading the file
		reader.readAsText(file);
	}

	// Regular expression to validate an IP address with sections ranging 0-255
	const ipRegex =
		/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;

	// Function to validate if the IP is in correct format (0-255 in all sections)
	function isValidIp(ip) {
		return ipRegex.test(ip);
	}

	// Function to add a new IP to the Scope IP list
	function addNewIp() {
		if (newIp.trim() === '') {
			errorMessage = 'IP address cannot be empty.';
		} else if (!isValidIp(newIp)) {
			errorMessage = 'Invalid IP address format.';
		} else if (ips.includes(newIp)) {
			errorMessage = 'IP already exists in the List.';
		} else {
			ips = [...ips, newIp];
			ipStatus = [...ipStatus, 'Allowed']; // Default status for new IP
			newIp = ''; // Clear the input field
			errorMessage = ''; // Clear any previous error
		}
		setTimeout(() => (errorMessage = ''), 3000);
	}

	async function startAnalysis() {
		const currentDisallowedIps = $disallowedIps;
		const currentDisallowedEntryPoints = $disallowedEntryPoints;

		console.log('the currentDisallowedIps are ', currentDisallowedIps);

		const requestBody = JSON.stringify({
			disallowedIps: currentDisallowedIps,
			disallowedEntryPoints: currentDisallowedEntryPoints,
			userId: userId,
			projectName: projectname
		});
		console.log('Request body: ', requestBody);
		try {
			const response = await fetch('http://localhost:5001/start-analysis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody
			});

			console.log('response is: ', response);

			if (response.ok) {
				navigateTo('/report/' + projectname);
			} else {
				notifications.update((n) => [...n, { message: `Network Error, check logs`, unread: true }]);
				addLog(`Network Error while executing analysis ${reponse}`);
				throw new Error('Error, Network response: ', response);
			}
		} catch (error) {
			addLog(`Network Error while communicating with server: ${error}`);
			console.error('Error starting analysis: ', error);
		}
	}

	async function fetchResults() {
		try {
			const response = await fetch('http://localhost:5001/parsed', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId: userId, projectName: projectname })
			});

			if (!response.ok) {
				notifications.update((n) => [
					...n,
					{ message: `Network Error, check logs`, unread: true }
				]);
				addLog(`Network Error while fetching results: ${reponse}`);
				throw new Error('Error, Network response: ', response);
			}

			const data = await response.json();

			const seenIps = new Set();
			const seenEntryPoints = new Set();

			// Separate unique IPs and entry points
			const uniqueIps = [];
			const uniqueEntryPoints = [];
			const severityMap = new Map(); // Map to keep severity by IP
			const pluginNameMap = new Map(); // Map to keep pluginName by IP

			data.forEach((item) => {
				// Add unique IPs
				if (!seenIps.has(item.ip)) {
					seenIps.add(item.ip);
					uniqueIps.push(item.ip);
					severityMap.set(item.ip, item.severity);
					pluginNameMap.set(item.ip, item.pluginName);
				}

				// Add unique entry points
				if (!seenEntryPoints.has(item.archetype)) {
					seenEntryPoints.add(item.archetype);
					uniqueEntryPoints.push(item.archetype);
				}
			});

			// Update the component state
			ips = uniqueIps;
			entryPoints = uniqueEntryPoints;
			severity = ips.map((ip) => severityMap.get(ip));
			pluginName = ips.map((ip) => pluginNameMap.get(ip));
			ipStatus = ips.map(() => 'Allowed');
			entryPointStatus = entryPoints.map(() => 'Allowed');
		} catch (error) {
			notifications.update((n) => [
				...n,
				{ message: `Error fetching results, check logs`, unread: true }
			]);
			addLog(`Error fetching results: ${error}`)
			console.error('Error fetching results: ', error);
		}
	}

	fetchResults();
</script>

<Menu {menuOpen} />

<div class="py-4 text-center">
	<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">{projectname}</h1>
</div>

<div class="flex min-h-screen flex-wrap gap-x-5 bg-gray-100 p-5 dark:bg-gray-900 md:flex-nowrap">
	<div class="flex w-full flex-col space-y-5 md:w-1/2">
		<!-- Left Section -->
		<div>
			<!-- File Upload -->
			<div
				class="file-upload cursor-pointer rounded border-2 border-dashed border-gray-300 p-2 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:hover:bg-gray-600"
			>
				<div class="flex flex-row items-center justify-center space-x-2">
					<!-- Text -->
					<h2 class="text-m flex dark:text-gray-200">Drag & Drop IP File --- OR ---></h2>

					<!-- Button -->
					<div class="relative inline-block">
						<button
							type="button"
							class="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Upload IP File
						</button>
						<input
							id="file-input"
							class="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
							type="file"
							multiple
							accept=".txt"
							on:change={handleFileSelect}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- IP List -->
		<div class="rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
			<h2 class="text-xl font-semibold text-gray-800 dark:text-white">Scope IP List</h2>
			<input
				type="text"
				bind:value={newIp}
				placeholder="Enter IP"
				class="mt-4 w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700"
			/>
			<button on:click={addNewIp} class="mt-2 w-full rounded bg-blue-600 py-2 text-white"
				>Add</button
			>
			{#if errorMessage}
				<p class="mt-2 text-red-500">{errorMessage}</p>
			{/if}
			<ul class="mt-4 space-y-3">
				{#each ips as ip, index}
					<li class="flex items-center justify-between">
						<span
							class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
							on:click={() => toggleIpStatus(index)}
							class:allowed_box={ipStatus[index] === 'Allowed'}
							class:off-limits_box={ipStatus[index] === 'Off-Limits'}
						></span>
						<span class="ml-4 text-gray-800 dark:text-gray-200">{ip}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Right Section -->
	<div class="mt-5 flex w-full flex-col space-y-5 md:mt-0 md:w-1/2">
		<!-- Start Analysis Button -->
		<div class="mt-5 flex w-full flex-col space-y-4 md:mt-0 md:w-full">
			<div class="py-50 text-center">
				<button on:click={startAnalysis} class="mt-2 w-60 rounded bg-blue-600 py-3 text-white"
					>Start Analysis</button
				>
			</div>
		</div>
		<!-- Archetype List -->
		<div class="rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
			<h2 class="text-xl font-semibold text-gray-800 dark:text-white">Archetype List</h2>
			<ul class="mt-4 space-y-3">
				{#each entryPoints as entryPoint, index}
					<li class="flex items-center justify-between">
						<span
							class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
							on:click={() => toggleEntryPointStatus(index)}
							class:allowed_box={entryPointStatus[index] === 'Allowed'}
							class:off-limits_box={entryPointStatus[index] === 'Off-Limits'}
						></span>
						<span class="ml-4 text-gray-800 dark:text-gray-200">{entryPoint}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.allowed_box {
		background-color: green;
	}

	.off-limits_box {
		background-color: red;
	}
</style>
