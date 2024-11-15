<script>
	import Menu from '../../lib/Menu.svelte';
	import { navigateTo } from '../../utils';
	import {disallowedIps,disallowedEntryPoints} from '../../disallowedfilter';

	let newIp = ''; // Stores the input for new IP
	let errorMessage = ''; // To store and display error messages

	let ips = [];
    //let disallowedIps = [];
	let ipStatus = [];

	let entryPoints = [];
	let entryPointStatus =[];
    //let disallowedEntryPoints = [];

	let projects = ['Project 1', 'Project 2', 'Project 3'];
	let menuOpen = false;

	let severity = [];

	let pluginName = [];

	// Toggle IP status between 'allowed' and 'off-limits'
	function toggleIpStatus(index) {
		ipStatus[index] = ipStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
        console.log(ipStatus[index])
        if (ipStatus[index] == 'Off-Limits') {
            console.log("off-limits")

            disallowedIps.update(currentIps => { return [...currentIps, ips[index]]; });

            console.log(disallowedIps)
        } else {

            disallowedIps.update(currentIps => { return currentIps.filter(ip => ip !== ips[index]); });

        }
	}

	// Toggle EntryPoint status between 'allowed' and 'off-limits'
	function toggleEntryPointStatus(index) {
		entryPointStatus[index] = entryPointStatus[index] === 'Allowed' ? 'Off-Limits' : 'Allowed';
        console.log(entryPointStatus[index])
        if (entryPointStatus[index] == 'Off-Limits') {
            console.log("off-limits")

            disallowedEntryPoints.update(currentEntryPoints => { return [...currentEntryPoints, entryPoints[index]]; });

            console.log(disallowedEntryPoints)
        } else {

            disallowedEntryPoints.update(currentEntryPoints => { return currentEntryPoints.filter(entry => entry !== entryPoints[index]); });

        }
	}

	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		const validFiles = selectedFiles.filter(file => file.name.endsWith('.txt'));

		if (validFiles.length !== selectedFiles.length) {
			alert('Only .txt files are allowed.');
			console.log('Invalid file type selected.');
		}

		validFiles.forEach(file => addIpsFromFile(file));
	}

	function addIpsFromFile(file) {
		const reader = new FileReader();

		reader.onload = () => {
			const content = reader.result;

			const lines = content.split(/\s+/);

			const validIps = lines.filter(ip => isValidIp(ip) && !ips.includes(ip));

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
		
		const currentDisallowedIps = $disallowedIps; 
		const currentDisallowedEntryPoints = $disallowedEntryPoints; 

        const requestBody = JSON.stringify({ disallowedIps: currentDisallowedIps, disallowedEntryPoints: currentDisallowedEntryPoints })

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
				navigateTo('/report');
			} else {
				throw new Error('Error, Network response: ', response);
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

			const uniqueData = [];
			const seenIps = new Set();
			const seenEntryPoints = new Set();

			data.forEach((item) => {
				if (!seenIps.has(item.ip) && !seenEntryPoints.has(item.archetype)) {
					seenIps.add(item.ip);
					seenEntryPoints.add(item.archetype);
					uniqueData.push(item);
				}
			});

			const inIps = [];
			const inEntryPoints = [];
			const inSeverity = [];
			const inPluginName = [];

			uniqueData.forEach((item) => {
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
			entryPointStatus = entryPoints.map(() => 'Allowed');
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
    <div class="flex flex-col w-full md:w-1/2 space-y-5">

	<!-- Left Section -->
	<div>
		<!-- File Upload -->
		<div class="file-upload cursor-pointer rounded border-2 border-dashed border-gray-300 p-2 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:hover:bg-gray-600">
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
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Scope IP List</h2>
			<input type="text" bind:value={newIp} placeholder="Enter IP" class="mt-4 w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" />
            <button on:click={addNewIp} class="mt-2 w-full py-2 bg-blue-600 text-white rounded">Add</button>
			{#if errorMessage}
                <p class="text-red-500 mt-2">{errorMessage}</p>
            {/if}
            <ul class="space-y-3 mt-4">
                {#each ips as ip, index}
                    <li class="flex items-center justify-between">
                        <span class="cursor-pointer rounded-full w-5 h-5 flex items-center justify-center" on:click={() => toggleIpStatus(index)}
							class:allowed_box={ipStatus[index] === 'Allowed'}
							class:off-limits_box={ipStatus[index] === 'Off-Limits'}></span>
                        <span class="ml-4 text-gray-800 dark:text-gray-200">{ip}</span>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <!-- Right Section -->
    <div class="flex flex-col w-full md:w-1/2 space-y-5 mt-5 md:mt-0">
		<!-- Start Analysis Button -->
		<div class="flex flex-col w-full md:w-full space-y-4 mt-5 md:mt-0">
			<div class="text-center py-50">
				<button on:click={startAnalysis} class="mt-2 w-60 py-3 bg-blue-600 text-white rounded">Start Analysis</button>
			</div>
		</div>
        <!-- Archetype List -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Archetype List</h2>
            <ul class="space-y-3 mt-4">
                {#each entryPoints as entryPoint, index}
                    <li class="flex items-center justify-between">
                        <span class="cursor-pointer rounded-full w-5 h-5 flex items-center justify-center" on:click={() => toggleEntryPointStatus(index)}
							class:allowed_box={entryPointStatus[index] === 'Allowed'}
							class:off-limits_box={entryPointStatus[index] === 'Off-Limits'}></span>
                        <span class="ml-4 text-gray-800 dark:text-gray-200">{entryPoint}</span>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>