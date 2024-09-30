
<script>
    import {navigateTo} from '../utils.js';

    function toggleMenu() {
        menuOpen = !menuOpen;
    }
    
    export let menuOpen = false;
</script>

<style>
    .menu {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 200px;
        background-color: rgba(83,109,130,255);
        color: #fff;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0,0,0,0.5);
        flex-direction: column;
        transition: transform 0.3s ease;
        transform: translateX(-100%);
    }

    .menu.open {
        display: flex;
        transform: translateX(0);
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
        z-index: 1000;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 24px;
        color: white;
        transition: left 0.3s ease;
    }

    .menu-button.open {
        left: 190px;
    }
</style>

<button class="menu-button {menuOpen ? 'open' : ''}" on:click={toggleMenu}>
    {#if menuOpen}
        <span class="material-symbols-outlined">chevron_left</span>
    {:else}
        <span class="material-symbols-outlined">chevron_right</span>
    {/if}
</button>

<div class="menu {menuOpen ? 'open' : ''}">
    <h2>INFILTR8</h2>
    <button on:click={() => navigateTo('/dashboard')}>Dashboard</button>
    <button on:click={() => navigateTo('/project')}>Project Manager</button>
    <button on:click={() => navigateTo('/analysis')}>Analysis</button>
    <button on:click={() => navigateTo('/report')}>Reports</button>
    <button on:click={() => navigateTo('/settings')}>Settings</button>
    <button on:click={() => navigateTo('/support')}>Support</button>
</div>