<script>
	import { onMount } from 'svelte';
	import Menu from '$lib/Menu.svelte';

	let ips = [];
	let entryPoints = [];
	let severity = [];
	let pluginName = [];
	let exportFormats = ['PDF', 'CSV', 'Excel'];
	let selectedFormat = exportFormats[0];
	let menuOpen = false;

	function handleExport() {
		// Handle export action
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	async function fetchResults() {
		try {
			const response = await fetch('http://localhost:5001/user-results');

			if (!response.ok) {
				throw new Error('Error, Network response: ', response);
			}

			const data = await response.json();

			const inIps = [];
			const inEntryPoints = [];
			const inSeverity = [];
			const inPluginName = [];

			data.forEach((item) => {
				inIps.push(item.ip);
				inEntryPoints.push(item.archetype);
				inSeverity.push(item.severity);
				inPluginName.push(item.pluginName);
			});

			ips = inIps;
			entryPoints = inEntryPoints;
			pluginName = inPluginName;
			severity = inSeverity;
		} catch (error) {
			console.error('Error fetching results: ', error);
		}
	}

	fetchResults();
</script>

<Menu {menuOpen} />

<div class="ml p-5">
	<div class="text-center py-4">
		<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Report</h1>
	</div>



	<!-- Go to Current Project Folder Button -->
	<button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md shadow-md mb-6"
		>Go to Current Project Folder</button
	>

	<!-- Device List -->
	<div class="border border-gray-300 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-sm mb-6 p-4">
		<ul class="space-y-2 ">
			<li class="font-bold text-gray-700 flex justify-between bg-gray-100 p-2 rounded-md overflow-x-auto">
				<span>IP Addresses</span>
				<span>Device</span>
				<span>Vulnerability</span>
				<!-- <span>Status</span> -->
			</li>
			{#each ips as ip, index}
				<li class="flex justify-between p-2 rounded-md hover:bg-gray-50 overflow-x-auto">
					<span>{ip}</span>
					<span>{entryPoints[index]}</span>
					<span>{severity[index]}</span>
					<!-- <span>{pluginName[index]}</span> -->
				</li>
			{/each}
		</ul>
	</div>

	<!-- Export Format Dropdown -->
	<div class="mb-6">
		<label for="export-format" class="block text-gray-700 dark:text-white mb-2"
			>Format to export</label
		>
		<select
			id="export-format"
			bind:value={selectedFormat}
			class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 w-40 focus:ring-2 focus:ring-blue-500"
		>
			{#each exportFormats as format}
				<option value={format}>{format}</option>
			{/each}
		</select>
	</div>

	<!-- Export Button -->
	<button
		class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
		on:click={handleExport}>Export</button
	>
</div>
