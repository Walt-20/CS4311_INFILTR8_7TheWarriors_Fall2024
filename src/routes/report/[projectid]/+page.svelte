<script>
	import { onMount } from 'svelte';
	import Menu from '$lib/Menu.svelte';
	import { jsPDF } from 'jspdf';
	import autoTable from 'jspdf-autotable';
	import * as XLSX from 'xlsx';
	
	export let data;
	const userId = data.user.username;

	let projectname = data.projectid;

	let dataWithExploits = {};
	let entrypointMostInfo = {};
	let port0Entries = {};
	let rankedEntryPoints = {};

	let ips = []; 

	let fileSelected = "1"; 
	let exportFormats = ['PDF', 'XML'];
	let selectedFormat = exportFormats[0];
	let menuOpen = false;

	// Modal state
	let showExportModal = false;
	let selectedFiles = [];
	let selectedExportFormat = selectedFormat;

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
		selectedExportFormat = selectedFormat;
	}

	function filterDevices() {
		let dataToFilter = [];
		switch (parseInt(fileSelected, 10)) {
			case 1:
				dataToFilter = Object.values(dataWithExploits);
				break;
			case 2:
				dataToFilter = Object.values(entrypointMostInfo);
				break;
			case 3:
				dataToFilter = Object.values(port0Entries);
				break;
			case 4:
				dataToFilter = Object.values(rankedEntryPoints);
				break;
			default:
				dataToFilter = [];
		}

		// Ensure structure consistency
		filteredResults = dataToFilter
			.filter(item => item) // Remove null/undefined items
			.filter(item => {
				const query = searchQuery.toLowerCase();
				let matches = false;

				if (searchCategory === "IP Addresses") {
					matches = item.ip && item.ip.toLowerCase().includes(query);
				} else if (searchCategory === "Port") {
					matches = item.port && String(item.port).includes(query);
				} else if (searchCategory === "Archetype" && (fileSelected === "1" || fileSelected === "3")) {
					matches = item.archetype && item.archetype.toLowerCase().includes(query);
				}
				return matches;
			});

		// Re-render if empty
		filteredResults = filteredResults || [];
	}

	function handleExport() {
		showExportModal = true;
	}

	function finalizeExport() {
		if (selectedFiles.length === 0) {
			alert('Please select at least one file to export.');
			return;
		}

		if (selectedExportFormat === 'PDF') {
			exportAsPDF(selectedFiles);
		} else if (selectedExportFormat === 'XML') {
			exportAsXML(selectedFiles);  // Ensure this is called for XML export
		}

		showExportModal = false; // Close the modal after exporting
	}

	function exportAsPDF(selectedFiles) {
		const doc = new jsPDF();
		let startY = 10; // Initial vertical position

		const fileMappings = {
			1: { data: dataWithExploits, name: "Data With Exploits" },
			2: { data: entrypointMostInfo, name: "Entrypoint Most Info" },
			3: { data: port0Entries, name: "Port 0 Entries" },
			4: { data: rankedEntryPoints, name: "Ranked Entry Points" },
		};

		selectedFiles.forEach(file => {
			const { data, name } = fileMappings[file];

			// Skip if no data is available for the file
			if (!data || Object.keys(data).length === 0) {
				doc.text(`No data available for ${name}`, 10, startY);
				startY += 10;
				return;
			}

			// Add table name as a section header
			doc.setFontSize(14);
			doc.text(name, 10, startY);
			startY += 10;

			// Extract table headers and rows
			const tableHeaders = Object.keys(Object.values(data)[0] || {});
			const tableRows = Object.values(data).map(item => Object.values(item));

			// Add table with autoTable
			autoTable(doc, {
				head: [tableHeaders],
				body: tableRows,
				startY: startY,
				margin: { top: 20 },
			});

			// Update startY for the next table
			startY = doc.lastAutoTable.finalY + 10;
		});

		// Save the combined document
		doc.save(`${projectname}.pdf`);
	}

	function exportAsXML(selectedFiles) {
		const fileMappings = {
			1: { data: dataWithExploits, name: "DataWithExploits" },
			2: { data: entrypointMostInfo, name: "EntrypointMostInfo" },
			3: { data: port0Entries, name: "Port0Entries" },
			4: { data: rankedEntryPoints, name: "RankedEntryPoints" },
		};

		// Helper function to escape XML special characters
		const escapeXML = (value) => {
			if (typeof value !== "string") return value;
			return value
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&apos;");
		};

		// Start the XML structure
		let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n`;

		// Process selected files
		selectedFiles.forEach((file) => {
			const { data, name } = fileMappings[file];

			// Add section even if no data is available
			xmlContent += `  <${name}>\n`;

			if (!data || Object.keys(data).length === 0) {
				xmlContent += `    <message>No data available</message>\n`;
			} else {
				// Convert each data entry to XML format
				Object.values(data).forEach((row) => {
					xmlContent += `    <entry>\n`;
					Object.entries(row).forEach(([key, value]) => {
						xmlContent += `      <${key}>${escapeXML(value)}</${key}>\n`;
					});
					xmlContent += `    </entry>\n`;
				});
			}

			// Close section
			xmlContent += `  </${name}>\n`;
		});

		// Close the root tag
		xmlContent += `</root>`;

		// Trigger download as an XML file
		const blob = new Blob([xmlContent], { type: "application/xml" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${projectname}.xml`;
		link.click();
	}

</script>

<Menu {menuOpen} />

<div class="ml p-5">
	<div class="py-4 text-center">
		<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">{projectname}'s Report</h1>
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
					<option>Port</option>
					<option>Archetype</option>
				</select>
				<input
					type="text"
					bind:value={searchQuery}
					on:input={filterDevices}
					on:keydown={(e) => e.key === 'Enter' && filterDevices()}
					placeholder={`Search ${fileSelected === '1' || fileSelected === '3' ? 'IP, Port, or Archetype' : 'IP or Port'}...`}
					class="flex-grow rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Select File to View -->
			<div class="w-1/2 space-y-2 order-2">
				<label class="block text-gray-700 dark:text-white">Select File to View</label>
				<select
					bind:value={fileSelected}
					class="rounded-md border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
					on:change={filterDevices} 
				>
					<option value="1">data_with_exploits</option>
					<option value="2">entrypoint_most_info</option>
					<option value="3">port_0_entries</option>
					<option value="4">ranked_entry_points</option>
				</select>
			</div>

			<!-- Export Format Dropdown -->
			<div class="w-1/2 space-y-2 order-3 grid justify-start place-items-center">
				<button
					class="rounded-md bg-blue-600 px-8 py-4 text-white shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					on:click={handleExport}>Export Files</button
				>
			</div>
		</div>
	</div>

	<!-- Export Modal -->
	{#if showExportModal}
		<div>
			<div class="modal-backdrop" on:click={() => (showExportModal = false)}></div>
			<div class="modal">
				<h2 class="text-lg font-bold mb-4">Select Files to Export</h2>
				<div class="mb-4">
					{#each ['data_with_exploits', 'entrypoint_most_info', 'port_0_entries', 'ranked_entry_points'] as file, index}
						<label>
							<input
								type="checkbox"
								bind:group={selectedFiles}
								value={index + 1}
							/>
							{file}
						</label>
						<br />
					{/each}
				</div>
				<div class="mb-4">
					<label>
						Format:
						<select bind:value={selectedExportFormat}> <!-- Change binding here -->
							{#each exportFormats as format}
								<option value={format}>{format}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="flex justify-end space-x-4">
					<button class="bg-gray-500 text-white px-4 py-2 rounded" on:click={() => (showExportModal = false)}>Cancel</button>
					<button class="bg-blue-600 text-white px-4 py-2 rounded" on:click={finalizeExport}>Export</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Conditional Rendering for Tables -->
	{#if fileSelected === "1"}
		<div class="table-container">
			<h2 class="block text-gray-700 dark:text-white">Data With Exploits</h2>
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
					{#each filteredResults as item}
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
		</div>
	{/if}

	{#if fileSelected === "2"}
		<div class="table-container">
			<h2 class="block text-gray-700 dark:text-white">Entrypoint Most Info</h2>
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
					{#each filteredResults as item}
						<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
							<span>{item.ip}</span>
							<span>{item.port}</span>
							<span>{item.vulnerability_count}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	{#if fileSelected === "3"}
		<div class="table-container">
			<h2 class="block text-gray-700 dark:text-white">Port 0 Entries</h2>
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
					{#each filteredResults as item}
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
		</div>
	{/if}

	{#if fileSelected === "4"}
		<div class="table-container">
			<h2 class="block text-gray-700 dark:text-white">Ranked Entry Points</h2>
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
					{#each filteredResults as item}
						<li class="grid grid-cols-6 gap-4 overflow-x-auto rounded-md p-2 hover:bg-gray-50">
							<span>{item.ip}</span>
							<span>{item.port}</span>
							<span>{item.severity_score}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

</div>

<style>
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		border-radius: 8px;
		width: 300px;
	}
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}
</style>