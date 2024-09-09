<script>
    import { onMount } from 'svelte';
    import Menu from '../../lib/Menu.svelte';

    let greeting = '';
    let notifications = ["Notification 1", "Notification 2", "Notification 3"];
    let files = [];
    let uploadProgress = 0;
    let ips = ["192.168.1.1", "192.168.1.2", "192.168.1.3"];
    let analyses = ["Analysis 1", "Analysis 2", "Analysis 3"];
    let projects = ["Project 1", "Project 2", "Project 3"];
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    onMount(() => {
        const hours = new Date().getHours();
        if (hours < 12) {
            greeting = 'Good Morning';
        } else if (hours < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
    });

    function handleFileSelect(event) {
        files = Array.from(event.target.files);
    }

    function handleCreateProject() {
        // Handle create project action
    }

    function handleDiscardAll() {
        files = [];
        uploadProgress = 0;
    }

    function moveUp(list, index) {
        if (index > 0) {
            [list[index - 1], list[index]] = [list[index], list[index - 1]];
        }
    }

    function moveDown(list, index) {
        if (index < list.length - 1) {
            [list[index + 1], list[index]] = [list[index], list[index + 1]];
        }
    }

    function startAnalysis() {
        // Handle start analysis action
    }
</script>

<style>
    .file-upload {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        margin-bottom: 20px;
    }

    .progress-bar {
        width: 100%;
        background-color: #f3f3f3;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress-bar div {
        height: 20px;
        background-color: #4caf50;
        width: 0;
    }

    .arrow {
        cursor: pointer;
        margin-left: 10px;
    }
</style>

<Menu {menuOpen} />

<button on:click={toggleMenu}>☰ Menu</button>

<h1>{greeting}, Analyst!</h1>

<h2>Notifications</h2>
<ul>
    {#each notifications as notification}
        <li>{notification}</li>
    {/each}
</ul>


<h2>Create New Project</h2>
<div class="file-upload">
    <p>Drag and drop a file here or</p>
    <input type="file" multiple on:change={handleFileSelect} />
</div>
<button on:click={handleFileSelect}>Select Files</button>
<button on:click={handleCreateProject}>Create Project</button>
<button on:click={handleDiscardAll}>Discard all</button>

<h2>Uploading Files</h2>
{#if files.length > 0}
    <ul>
        {#each files as file}
            <li>{file.name}</li>
        {/each}
    </ul>
    <div class="progress-bar">
        <div style="width: {uploadProgress}%"></div>
    </div>
{:else}
    <p>No files being uploaded.</p>
{/if}

<h2>Current project folder</h2>
<button>Go to Current Project Folder</button>

<h2>Scope IP List</h2>
<ul>
    {#each ips as ip, index}
        <li>
            {ip}
            <span class="arrow" on:click={() => moveUp(ips, index)}>⬆️</span>
            <span class="arrow" on:click={() => moveDown(ips, index)}>⬇️</span>
        </li>
    {/each}
</ul>

<h2>Entry Points Allowed</h2>
<ul>
    {#each analyses as analysis, index}
        <li>
            {analysis}
            <span class="arrow" on:click={() => moveUp(analyses, index)}>⬆️</span>
            <span class="arrow" on:click={() => moveDown(analyses, index)}>⬇️</span>
        </li>
    {/each}
</ul>

<button on:click={startAnalysis}>Start Analysis</button>

<h2>Load Projects</h2>
<ul>
    {#each projects as project}
        <li>{project}</li>
    {/each}
</ul>