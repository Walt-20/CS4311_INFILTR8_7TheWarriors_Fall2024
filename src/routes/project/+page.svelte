<script>
	import Menu from '../../lib/Menu.svelte';
	import { navigateTo } from '../../utils';

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

	// Toggle IP status between 'allowed' and 'off-limits'
	function toggleStatus(index) {
		ipStatus[index] = ipStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
		console.log(ipStatus[index]);
		if (ipStatus[index] == 'Off-Limits') {
			disallowedIps.push(ips[index]);
			disallowedEntryPoints.push(entryPoints[index]);
		} else {
			console.log("is this working?")
			disallowedIps = disallowedIps.filter((ip) => ip !== ips[index]);
			disallowedEntryPoints = disallowedEntryPoints.filter((entry) => entry !== entryPoints[index]);
		}
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
			ipStatus = [...ipStatus, 'allowed']; // Default status for new IP
			newIp = ''; // Clear the input field
			errorMessage = ''; // Clear any previous error
		}
	}

	function moveUp(list, statusList, index) {
		if (index > 0) {
			const newList = [...list];
			const newStatusList = [...statusList];
			[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
			[newStatusList[index - 1], newStatusList[index]] = [
				newStatusList[index],
				newStatusList[index - 1]
			];
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
			[newStatusList[index + 1], newStatusList[index]] = [
				newStatusList[index],
				newStatusList[index + 1]
			];
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

<style>
	.allowed_box {
		background-color: green;
	}

	.off-limits_box {
		background-color: red;
	}
</style>

<Menu {menuOpen} />

<div class="text-center py-4">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Current Project</h1>
</div>

<div class="flex flex-wrap md:flex-nowrap gap-x-5 p-5 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <!-- Left Section: IP List & Entry Points -->
    <div class="flex flex-col w-full md:w-1/2 space-y-5">
        <!-- IP List -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Scope IP List</h2>
            <ul class="space-y-3 mt-4">
                {#each ips as ip, index}
                    <li class="flex items-center justify-between">
                        <span class="cursor-pointer rounded-full w-5 h-5 flex items-center justify-center" on:click={() => toggleStatus(index)}
							class:allowed_box={ipStatus[index] === 'Allowed'}
							class:off-limits_box={ipStatus[index] === 'Off-Limits'}></span>
                        <span class="ml-4 text-gray-800 dark:text-gray-200">{ip}</span>
                        <span class="ml-4 text-gray-800 dark:text-gray-200">{entryPoints[index]}</span>
                    </li>
                {/each}
            </ul>
            <input type="text" bind:value={newIp} placeholder="Enter IP" class="mt-4 w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
            <button on:click={addNewIp} class="mt-2 w-full py-2 bg-blue-600 text-white rounded">Add</button>
            {#if errorMessage}
                <p class="text-red-500 mt-2">{errorMessage}</p>
            {/if}
        </div>
        <div class="text-center py-50">
            <button on:click={startAnalysis} class="mt-2 w-60 py-2 bg-blue-600 text-white rounded">Start Analysis</button>
        </div>
    </div>

    <!-- Right Section: Create Project and Load Projects -->
    <div class="flex flex-col w-full md:w-1/2 space-y-5 mt-5 md:mt-0">
        <!-- Load Projects Box -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Load Projects</h2>
            <ul class="mt-4 space-y-3">
                <li class="flex items-center p-3 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                    <span class="mr-4">📁</span>
                    <span class="text-gray-800 dark:text-gray-200">Project 1</span>
                </li>
                <li class="flex items-center p-3 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                    <span class="mr-4">📁</span>
                    <span class="text-gray-800 dark:text-gray-200">Project 2</span>
                </li>
            </ul>
        </div>
    </div>
</div>