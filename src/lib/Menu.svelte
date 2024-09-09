<script>
    import { goto } from '$app/navigation';
    export let menuOpen = false;

    function navigateTo(path) {
        goto(path);
    }
</script>

<style>
    .menu {
        position: fixed;
        left: 0;
        top: 0;
        width: 200px;
        height: 100%;
        background-color: #333;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    .menu.open {
        transform: translateX(0);
    }

    .menu button {
        background: none;
        border: none;
        color: white;
        text-align: left;
        padding: 10px;
        cursor: pointer;
    }

    .menu button:hover {
        background-color: #444;
    }
</style>

<div class="menu {menuOpen ? 'open' : ''}">
    <h2>INFILTR8</h2>
    <button on:click={() => navigateTo('/dashboard')}>Dashboard</button>
    <button on:click={() => navigateTo('/project-manager')}>Project Manager</button>
    <button on:click={() => navigateTo('/analysis')}>Analysis</button>
    <button on:click={() => navigateTo('/reports')}>Reports</button>
    <button on:click={() => navigateTo('/settings')}>Settings</button>
    <button on:click={() => navigateTo('/support')}>Support</button>
</div>