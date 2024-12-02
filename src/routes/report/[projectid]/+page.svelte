<script>
	import { onMount } from 'svelte';
	import Menu from '$lib/Menu.svelte';
	import { jsPDF } from 'jspdf';
	import * as XLSX from 'xlsx';

	
	export let data;
	const userId = data.user.username;

	let projectname = data.projectid;

	let dataWithExploits = {};
	let entrypointMostInfo = {};
	let port0Entries = {};
	let rankedEntryPoints = {};

	let exportFormats = ['PDF', 'XML'];
	let selectedFormat = exportFormats[0];
	let menuOpen = false;

	let searchCategory = 'IP Addresses'; // Declare searchCategory
	let searchQuery = ''; // Declare searchQuery
	let filteredResults = []; // Store filtered results

	onMount(async () => {
		await fetchResults();
	});

	async function fetchResults() {
		try {
			const response = await fetch('http://localhost:5001/user-results', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId: userId, projectname: projectname })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			let id = 0;
			dataWithExploits = data['data_with_exploits.csv'].reduce((acc, item) => {
				acc[id++] = {
					ip: item.ip,
					port: item.port,
					protocol: item.protocol,
					archetype: item.archetype,
					severity: item.severity,
					pluginName: item.pluginName
				};
				return acc;
			}, {});

			id = 0;
			entrypointMostInfo = data['entrypoint_most_info.csv'].reduce((acc, item) => {
				acc[id++] = {
					ip: item.ip,
					port: item.port,
					vulnerability_count: item.vulnerability_count
				};
				return acc;
			}, {});

			id = 0;
			port0Entries = data['port_0_entries.csv'].reduce((acc, item) => {
				acc[id++] = {
					ip: item.ip,
					port: item.port,
					protocol: item.protocol,
					archetype: item.archetype,
					severity: item.severity,
					pluginName: item.pluginName
				};
				return acc;
			}, {});

			id = 0;
			rankedEntryPoints = data['ranked_entry_points.csv'].reduce((acc, item) => {
				acc[id++] = {
					ip: item.ip,
					port: item.port,
					severity_score: item.severity_score
				};
				return acc;
			}, {});

			// Initialize filteredResults with the full list on mount
			filterDevices();
		} catch (error) {
			console.error('Error fetching results:', error);
		}
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
		addLog(`Menu toggled: ${menuOpen ? 'Opened' : 'Closed'}`);
	}

	function handleFormatChange() {
		addLog(`Export format changed to: ${selectedFormat}`);
	}

	function filterDevices() {
		filteredResults = ips
			.map((ip, index) => ({
				ip,
				device: archetype[index],
				vulnerability: severity[index]
			}))
			.filter((item) => {
				if (searchCategory === 'IP Addresses') {
					return item.ip.includes(searchQuery);
				} else if (searchCategory === 'Device') {
					return item.device.toLowerCase().includes(searchQuery.toLowerCase());
				} else if (searchCategory === 'Vulnerability') {
					return item.vulnerability.toLowerCase().includes(searchQuery.toLowerCase());
				}
				return true;
			});
	}

	function handleExport() {
		if (selectedFormat === 'XML') {
			exportAsXML(1);
		} else if (selectedFormat === 'PDF') {
			exportAsPDF(1);
		}
	}

	function exportAsPDF(selectedDataNumber) {
		const doc = new jsPDF();
		let dataToExport;

		switch (selectedDataNumber) {
			case 1:
				dataToExport = dataWithExploits;
				doc.text("Data With Exploits Report", 10, 10);
				break;
			case 2:
				dataToExport = entrypointMostInfo;
				doc.text("Entrypoint Most Info Report", 10, 10);
				break;
			case 3:
				dataToExport = port0Entries;
				doc.text("Port 0 Entries Report", 10, 10);
				break;
			case 4:
				dataToExport = rankedEntryPoints;
				doc.text("Ranked Entry Points Report", 10, 10);
				break;
			default:
				console.error("Invalid data number");
				return;
		}

		let y = 20;
		Object.values(dataToExport).forEach((item) => {
			const row = Object.values(item).join(" - ");
			doc.text(row, 10, y);
			y += 10;
		});

		doc.save(`report_${selectedDataNumber}.pdf`);
	}

	function exportAsXML(selectedDataNumber) {
		let dataToExport;
		let rootName;

		switch (selectedDataNumber) {
			case 1:
				dataToExport = dataWithExploits;
				rootName = "DataWithExploits";
				break;
			case 2:
				dataToExport = entrypointMostInfo;
				rootName = "EntrypointMostInfo";
				break;
			case 3:
				dataToExport = port0Entries;
				rootName = "Port0Entries";
				break;
			case 4:
				dataToExport = rankedEntryPoints;
				rootName = "RankedEntryPoints";
				break;
			default:
				console.error("Invalid data number");
				return;
		}
		
		let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
		Object.values(dataToExport).forEach((item) => {
			xmlContent += "  <entry>\n";
			for (const [key, value] of Object.entries(item)) {
				xmlContent += `    <${key}>${value}</${key}>\n`;
			}
			xmlContent += "  </entry>\n";
		});
		xmlContent += `</${rootName}>`;

		// Export the XML
		const blob = new Blob([xmlContent], { type: "text/xml;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `report_${selectedDataNumber}.xml`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

</script>

<Menu {menuOpen} />

<div class="ml p-5">
	<div class="py-4 text-center">
		<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">{projectname}'s Report</h1>
	</div>
	<div>
	<select>
        <option>data_with_exploits.csv</option>
        <option>entrypoint_most_info.csv</option>
        <option>port_0_entries.csv</option>
        <option>ranked_entry_points.csv</option>
    </select> 
	</div>

	<!-- Search Section -->
	<div>
		<div class="flex flex-row space-x-2 py-2">
			<div class="w-1/2 space-y-2 order-1">
				<label class="block text-gray-700 dark:text-white">Search by</label>
				<select
					bind:value={searchCategory}
					class="rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
					on:change={filterDevices}
				>
					<option>IP Addresses</option>
					<option>Device</option>
					<option>Vulnerability</option>
				</select>
				<input
					type="text"
					bind:value={searchQuery}
					on:input={filterDevices}
					placeholder={`Search ${searchCategory.toLowerCase()}...`}
					class="flex-grow rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Export Format Dropdown -->
			<div class="w-1/2 space-y-2 order-2">
				<label for="export-format" class="block text-gray-700 dark:text-white">Format to export</label>
				<select
					id="export-format"
					bind:value={selectedFormat}
					class="w-40 rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
				>
					{#each exportFormats as format}
						<option value={format}>{format}</option>
					{/each}
				</select>
				<button
					class="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					on:click={handleExport}>Export</button
				>
			</div>
		</div>
	</div>

	<!-- data_with_exploits table -->
	<div class="mb-6 rounded-lg border border-gray-300 bg-gray-300 p-4 shadow-sm dark:bg-gray-600">
		<ul class="space-y-2">
			<li
				class="flex justify-between overflow-x-auto rounded-md bg-gray-100 p-2 font-bold text-gray-700"
			>
				<span>IP Address</span>
				<span>Port</span>
				<span>Protocol</span>
				<span>Archetype</span>
				<span>Plugin Name</span>
				<span>Severity</span>
			</li>
			{#each Object.values(dataWithExploits) as item}
				<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
					<span>{item.ip}</span>
					<span>{item.port}</span>
					<span>{item.protocol}</span>
					<span>{item.archetype}</span>
					<span>{item.pluginName}</span>
					<span>{item.severity}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- entrypoint_most_info table -->
	<div class="mb-6 rounded-lg border border-gray-300 bg-gray-300 p-4 shadow-sm dark:bg-gray-600">
		<ul class="space-y-2">
			<li
				class="flex justify-between overflow-x-auto rounded-md bg-gray-100 p-2 font-bold text-gray-700"
			>
				<span>IP Address</span>
				<span>Port</span>
				<span>Vulnerbaility Count</span>
			</li>
			{#each Object.values(entrypointMostInfo) as item}
				<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
					<span>{item.ip}</span>
					<span>{item.port}</span>
					<span>{item.vulnerability_count}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- port_0_entries table -->
	<div class="mb-6 rounded-lg border border-gray-300 bg-gray-300 p-4 shadow-sm dark:bg-gray-600">
		<ul class="space-y-2">
			<li
				class="flex justify-between overflow-x-auto rounded-md bg-gray-100 p-2 font-bold text-gray-700"
			>
				<span>IP Address</span>
				<span>Port</span>
				<span>Protocol</span>
				<span>Archetype</span>
				<span>Plugin Name</span>
				<span>Severity</span>
			</li>
			{#each Object.values(port0Entries) as item}
				<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
					<span>{item.ip}</span>
					<span>{item.port}</span>
					<span>{item.protocol}</span>
					<span>{item.archetype}</span>
					<span>{item.pluginName}</span>
					<span>{item.severity}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- ranked_entry_points table -->
	<div class="mb-6 rounded-lg border border-gray-300 bg-gray-300 p-4 shadow-sm dark:bg-gray-600">
		<ul class="space-y-2">
			<li
				class="flex justify-between overflow-x-auto rounded-md bg-gray-100 p-2 font-bold text-gray-700"
			>
				<span>IP Address</span>
				<span>Port</span>
				<span>Severity Score</span>
			</li>
			{#each Object.values(rankedEntryPoints) as item}
				<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
					<span>{item.ip}</span>
					<span>{item.port}</span>
					<span>{item.severity_score}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
