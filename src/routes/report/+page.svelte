<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import { addLog } from '$lib/logStore.js'; // Import log function

    let devices = [
        { ip: "192.168.1.1", device: "Router", vulnerability: "High", status: "Active" },
        { ip: "192.168.1.2", device: "Switch", vulnerability: "Medium", status: "Inactive" },
        { ip: "192.168.1.3", device: "Server", vulnerability: "Low", status: "Active" }
    ];
    let exportFormats = ["PDF", "CSV", "Excel"];
    let selectedFormat = exportFormats[0];
    let menuOpen = false;
    
    // Search functionality variables
    let searchQuery = '';
    let searchCategory = 'IP Addresses';
    let filteredDevices = devices;

    function handleExport() {
        addLog(`Export button clicked. Format: ${selectedFormat}`);
    }

    function toggleMenu() {
        menuOpen = !menuOpen;
        addLog(`Menu toggled: ${menuOpen ? 'Opened' : 'Closed'}`);
    }

    function handleFormatChange() {
        addLog(`Export format changed to: ${selectedFormat}`);
    }

    // Filter devices based on search query and category
    function filterDevices() {
        filteredDevices = devices.filter(device => {
            if (searchCategory === 'IP Addresses') {
                return device.ip.includes(searchQuery);
            } else if (searchCategory === 'Device') {
                return device.device.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (searchCategory === 'Vulnerability') {
                return device.vulnerability.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });
    }
</script>

<Menu {menuOpen} />

<div class="ml p-5">

    <div class="text-center py-4">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Report</h1>
    </div>

    <!-- Menu Toggle Button -->
    <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-6" on:click={toggleMenu}>☰ Menu</button>

    <!-- Go to Current Project Folder Button -->
    <button class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md shadow-md mb-6">Go to Current Project Folder</button>

    <!-- Search Bar -->
    <div class="mb-6">
        <label class="block text-gray-700 dark:text-white mb-2">Search by</label>
        <div class="flex items-center space-x-2">
            <select bind:value={searchCategory} class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500">
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

    <!-- Device List -->
    <div class="border border-gray-300 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-sm mb-6 p-4">
        <ul class="space-y-2">
            <li class="font-bold text-gray-700 flex justify-between bg-gray-100 p-2 rounded-md">
                <span>IP Addresses</span>
                <span>Device</span>
                <span>Vulnerability</span>
                <span>Status</span>
            </li>
            {#each filteredDevices as device}
                <li class="flex justify-between p-2 rounded-md hover:bg-gray-50">
                    <span>{device.ip}</span>
                    <span>{device.device}</span>
                    <span>{device.vulnerability}</span>
                    <span>{device.status}</span>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Export Format Dropdown -->
    <div class="mb-6">
        <label for="export-format" class="block text-gray-700 dark:text-white mb-2">Format to export</label>
        <select id="export-format" bind:value={selectedFormat} on:change={handleFormatChange} class="bg-gray-200 border border-gray-300 rounded-md py-2 px-4 w-40 focus:ring-2 focus:ring-blue-500">    
            {#each exportFormats as format}
            <option value={format}>{format}</option>
            {/each}
        </select>
    </div>

    <!-- Export Button -->
    <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" on:click={handleExport}>Export</button>
</div>
