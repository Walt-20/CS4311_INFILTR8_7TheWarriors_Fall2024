<script>
	import Menu from '../../lib/Menu.svelte';
	import { BriefcaseSolid } from 'flowbite-svelte-icons';
	import { colorBlindMode } from '$lib/settingStore.js'; // Import the colorBlindMode store

	let newIp = ''; // Stores the input for new IP
	let errorMessage = ''; // To store and display error messages

	let ips = [];
	let disallowedIps = [];
	let ipStatus = [];

	let entryPoints = [];
	let disallowedEntryPoints = [];
	let projects = ['Project 1', 'Project 2', 'Project 3'];
	let menuOpen = false;

	let severity = [];
	let pluginName = [];

	function toggleStatus(index) {
		ipStatus[index] = ipStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
		if (ipStatus[index] === 'Off-Limits') {
			disallowedIps.push(ips[index]);
			disallowedEntryPoints.push(entryPoints[index]);
		} else {
			disallowedIps = disallowedIps.filter((ip) => ip !== ips[index]);
			disallowedEntryPoints = disallowedEntryPoints.filter((entry) => entry !== entryPoints[index]);
		}
	}

	const ipRegex =
		/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;

	function isValidIp(ip) {
		return ipRegex.test(ip);
	}

	function addNewIp() {
		if (newIp.trim() === '') {
			errorMessage = 'IP address cannot be empty.';
		} else if (!isValidIp(newIp)) {
			errorMessage = 'Invalid IP address format.';
		} else if (ips.includes(newIp)) {
			errorMessage = 'IP already exists in the List.';
		} else {
			ips = [...ips, newIp];
			ipStatus = [...ipStatus, 'Allowed']; 
			newIp = ''; 
			errorMessage = ''; 
		}
	}

	function moveUp(list, statusList, index) {
		if (index > 0) {
			const newList = [...list];
			const newStatusList = [...statusList];
			[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
			[newStatusList[index - 1], newStatusList[index]] = [newStatusList[index], newStatusList[index - 1]];
			if (list === ips) {
				ips = newList;
				ipStatus = newStatusList;
			} else {
				entryPoints = newList;
			}
		}
	}

	function moveDown(list, statusList, index) {
		if (index < list.length - 1) {
			const newList = [...list];
			const newStatusList = [...statusList];
			[newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
			[newStatusList[index + 1], newStatusList[index]] = [newStatusList[index], newStatusList[index + 1]];
			if (list === ips) {
				ips = newList;
				ipStatus = newStatusList;
			} else {
				entryPoints = newList;
			}
		}
	}

	async function startAnalysis() {
		const requestBody = JSON.stringify({ disallowedIps, disallowedEntryPoints });

		try {
			const response = await fetch('http://localhost:5001/start-analysis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody
			});

			if (!response.ok) {
				throw new Error('Error, Network response: ', response);
			} else {
				navigateTo('/report');
			}
		} catch (error) {
			console.error('Error starting analysis: ', error);
		}
	}

	// create function here to make a call to http://localhost:5001/parsed-results

	// this will give you back the json.

	// parse that json into two separate lists, one for ips and one for entry points

	/* 
    
    * {
    *    "ip": "10.31.112.29",
    *    "archetype": "Other",
    *    "pluginName": "Nessus Scan Information"
    * },
    
    */

	async function fetchResults() {
		try {
			const response = await fetch('http://localhost:5001/parsed');

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
			ipStatus = ips.map(() => 'Allowed');
		} catch (error) {
			console.error('Error fetching results: ', error);
		}
	}

	fetchResults();
</script>

<Menu {menuOpen} />

<div class="text-center py-4">
    <h1 class={`text-4xl font-bold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-200'}`}>Current Project</h1>
</div>

<div class={`flex flex-wrap p-5 min-h-screen ${$colorBlindMode ? 'color-blind-bg' : 'bg-gray-100 dark:bg-gray-900'}`}>
    <!-- Left Section: IP List & Entry Points -->
    <div class="flex flex-col w-full md:w-1/2 space-y-5">
        <!-- IP List -->
        <div class={`shadow-lg rounded-lg p-5 ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-800'}`}>
            <h2 class={`text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-white'}`}>Scope IP List</h2>
            <ul class="space-y-3 mt-4">
                {#each ips as ip, index}
                <li class="flex items-center justify-between">
                    <span class={`cursor-pointer rounded-full w-5 h-5 flex items-center justify-center ${ipStatus[index] === 'Allowed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span class={`ml-4 ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-200'}`}>{ip}</span>
                    <span class={`ml-4 ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-200'}`}>{entryPoints[index]}</span>
                    <div class="flex space-x-2">
                        <button class={`material-symbols-outlined ${$colorBlindMode ? 'color-blind-text' : 'text-gray-600 dark:text-gray-400'}`} on:click={() => moveUp(ips, ipStatus, index)}>keyboard_arrow_up</button>
                        <button class={`material-symbols-outlined ${$colorBlindMode ? 'color-blind-text' : 'text-gray-600 dark:text-gray-400'}`} on:click={() => moveDown(ips, ipStatus, index)}>keyboard_arrow_down</button>
                    </div>
                </li>
                {/each}
            </ul>
            <input type="text" bind:value={newIp} placeholder="Enter IP" class={`mt-4 w-full p-2 rounded border ${$colorBlindMode ? 'color-blind-border' : 'dark:bg-gray-700 dark:border-gray-600'}`} />
            <button on:click={addNewIp} class={`mt-2 w-full py-2 rounded ${$colorBlindMode ? 'color-blind-button' : 'bg-blue-600 text-white'}`}>Add</button>
        </div>
    </div>

    <!-- Right Section: Create Project and Load Projects -->
    <div class="flex flex-col w-full md:w-1/2 space-y-5 mt-5 md:mt-0">
        <!-- Create Project Box -->
        <div class={`shadow-lg rounded-lg p-5 ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-800'}`}>
            <h2 class={`text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-white'}`}>Create New Project</h2>
            <button class={`mt-4 w-full py-2 rounded ${$colorBlindMode ? 'color-blind-button' : 'bg-blue-600 text-white font-semibold'}`}>Create New Project</button>
        </div>

        <!-- Load Projects Box -->
        <div class={`shadow-lg rounded-lg p-5 ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-800'}`}>
            <h2 class={`text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-white'}`}>Load Projects</h2>
            <ul class="mt-4 space-y-3">
                {#each projects as project}
                <li class={`flex items-center p-3 rounded cursor-pointer transition ${$colorBlindMode ? 'color-blind-item' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                    <span class="mr-4">📁</span>
                    <span class={`text-gray-800 dark:text-gray-200 ${$colorBlindMode ? 'color-blind-text' : ''}`}>{project}</span>
                </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    .color-blind-text {
        color: #264653;
    }
    .color-blind-bg {
        background-color: #273043;
    }
    .color-blind-section {
        background-color: #F4A261;
        border-color: #E76F51;
    }
    .color-blind-border {
        border-color: #E76F51;
    }
    .color-blind-button {
        background-color: #FF7F11;
        color: white;
    }
    .color-blind-item {
        background-color: #F4A261;
        color: #264653;
    }
</style>
