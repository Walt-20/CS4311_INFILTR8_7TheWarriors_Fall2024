<script>
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    function navigateTo(path) {
        // Implement your navigation logic here
        console.log(`Navigating to ${path}`);
    }
</script>

<style>
    body {
        background-color: grey;
    }

    .file-upload {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
    }

    .progress-bar div {
        height: 20px;
        background-color: #4caf50;
        width: 0;
    }

    h1, h2, ul, p {
        color: green;
    }

    nav {
        display: flex;
        justify-content: flex-start;
    }

    .menu {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 200px;
        background-color: #333;
        color: white;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0,0,0,0.5);
        flex-direction: column;
    }

    .menu.open {
        display: flex;
    }

    .menu button {
        background: none;
        border: none;
        color: white;
        text-align: left;
        padding: 10px;
        width: 100%;
        cursor: pointer;
    }

    .menu button:hover {
        background-color: #444;
    }

    .menu-button {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1000; /* Ensure the button is on top */
    }
</style>

<button class="menu-button" on:click={toggleMenu}>
    {#if menuOpen}
        &#9650; <!-- Up arrow -->
    {:else}
        &#9660; <!-- Down arrow -->
    {/if}
</button>

<div class="menu {menuOpen ? 'open' : ''}">
    <h2>INFILTR8</h2>
    <button on:click={() => navigateTo('/dashboard')}>Dashboard</button>
    <button on:click={() => navigateTo('/project-manager')}>Project Manager</button>
    <button on:click={() => navigateTo('/analysis')}>Analysis</button>
    <button on:click={() => navigateTo('/reports')}>Reports</button>
    <button on:click={() => navigateTo('/settings')}>Settings</button>
    <button on:click={() => navigateTo('/support')}>Support</button>
</div>