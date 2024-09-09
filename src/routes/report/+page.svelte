<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';

    let devices = [
        { ip: "192.168.1.1", device: "Router", vulnerability: "High", status: "Active" },
        { ip: "192.168.1.2", device: "Switch", vulnerability: "Medium", status: "Inactive" },
        { ip: "192.168.1.3", device: "Server", vulnerability: "Low", status: "Active" }
    ];
    let exportFormats = ["PDF", "CSV", "Excel"];
    let selectedFormat = exportFormats[0];
    let menuOpen = false;

    function handleExport() {
        // Handle export action
    }

    function toggleMenu() {
        menuOpen = !menuOpen;
    }
</script>

<style>
    .content {
        margin-left: 220px;
        padding: 20px;
    }

    .device-list {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
    }

    .device-list ul {
        list-style-type: none;
        padding: 0;
    }

    .device-list li {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }

    .device-list li:nth-child(odd) {
        background-color: #f9f9f9;
    }

    .device-list .header {
        font-weight: bold;
    }
</style>

<Menu {menuOpen} />

<div class="content">
    <button on:click={toggleMenu}>☰ Menu</button>

    <h1>Report</h1>
    <button>Go to Current Project Folder</button>

    <div class="device-list">
        <ul>
            <li class="header">
                <span>IP Addresses</span>
                <span>Device</span>
                <span>Vulnerability</span>
                <span>Status</span>
            </li>
            {#each devices as device}
                <li>
                    <span>{device.ip}</span>
                    <span>{device.device}</span>
                    <span>{device.vulnerability}</span>
                    <span>{device.status}</span>
                </li>
            {/each}
        </ul>
    </div>

    <div>
        <label for="export-format">Format to export</label>
        <select id="export-format" bind:value={selectedFormat}>
            {#each exportFormats as format}
                <option value={format}>{format}</option>
            {/each}
        </select>
    </div>

    <button on:click={handleExport}>Export</button>
</div>