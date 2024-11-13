<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import { jsPDF } from 'jspdf';
    import * as XLSX from 'xlsx';

    let ips = [];
    let entryPoints = [];
    let severity = [];
    let pluginName = [];
    let exportFormats = ['PDF', 'CSV', 'Excel'];
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
            const response = await fetch('http://localhost:5001/user-results');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            ips = data.map(item => item.ip);
            entryPoints = data.map(item => item.archetype);
            severity = data.map(item => item.severity);
            pluginName = data.map(item => item.pluginName);

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
        filteredResults = ips.map((ip, index) => ({
            ip,
            device: entryPoints[index],
            vulnerability: severity[index]
        })).filter(item => {
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
        if (selectedFormat === 'CSV') {
            exportAsCSV();
        } else if (selectedFormat === 'PDF') {
            exportAsPDF();
        } else if (selectedFormat === 'Excel') {
            exportAsExcel();
        }
    }

    function exportAsCSV() {
        const csvContent = [
            ["IP Address", "Device", "Vulnerability"], // Header row
            ...filteredResults.map(item => [item.ip, item.device, item.vulnerability].join(",")) // Data rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportAsPDF() {
        const doc = new jsPDF();
        doc.text("Report", 10, 10);
        filteredResults.forEach((item, index) => {
            doc.text(`${item.ip} - ${item.device} - ${item.vulnerability}`, 10, 20 + (10 * index));
        });
        doc.save('report.pdf');
    }

    function exportAsExcel() {
        const data = filteredResults.map(item => ({
            IP: item.ip,
            Device: item.device,
            Vulnerability: item.vulnerability
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, 'report.xlsx');
    }
</script>

<Menu {menuOpen} />

<div class="ml p-5">
    <div class="text-center py-4">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Report</h1>
    </div>

    <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-6" on:click={toggleMenu}>☰ Menu</button>

    <button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md shadow-md mb-6">Go to Current Project Folder</button>

    <!-- Search Section -->
    <div class="mb-6">
        <label class="block text-gray-700 dark:text-white mb-2">Search by</label>
        <div class="flex items-center space-x-2">
            <select bind:value={searchCategory} class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500" on:change={filterDevices}>
                <option>IP Addresses</option>
                <option>Device</option>
                <option>Vulnerability</option>
            </select>
            <input 
                type="text" 
                bind:value={searchQuery} 
                on:input={filterDevices} 
                placeholder={`Search ${searchCategory.toLowerCase()}...`} 
                class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 flex-grow focus:ring-2 focus:ring-blue-500" 
            />
        </div>
    </div>

    <!-- Filtered Device List -->
    <div class="border border-gray-300 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-sm mb-6 p-4">
        <ul class="space-y-2">
            <li class="font-bold text-gray-700 flex justify-between bg-gray-100 p-2 rounded-md overflow-x-auto">
                <span>IP Addresses</span>
                <span>Device</span>
                <span>Vulnerability</span>
            </li>
            {#each filteredResults as item}
                <li class="flex justify-between p-2 rounded-md hover:bg-gray-50 overflow-x-auto">
                    <span>{item.ip}</span>
                    <span>{item.device}</span>
                    <span>{item.vulnerability}</span>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Export Format Dropdown -->
    <div class="mb-6">
        <label for="export-format" class="block text-gray-700 dark:text-white mb-2">Format to export</label>
        <select id="export-format" bind:value={selectedFormat} class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 w-40 focus:ring-2 focus:ring-blue-500">
            {#each exportFormats as format}
                <option value={format}>{format}</option>
            {/each}
        </select>
    </div>

    <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        on:click={handleExport}>Export</button>
</div>
