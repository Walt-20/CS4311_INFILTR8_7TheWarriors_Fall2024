<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import Notification from '$lib/Notification.svelte';

    let greeting = '';
    let notifications = [
        { message: "Notification 1", unread: true }, 
        { message: "Notification 2", unread: false }, 
        {message: "Notification 3", unread: true }
    ];
    let files = [];
    let uploadProgress = 0;
    let menuOpen = false;

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

    function toggleMenu() {
        menuOpen = !menuOpen;
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
    
    .notification {
        display: flex;
        align-items: center;
    }

    .notification h2 {
        display: flex;
        align-items: center;
        margin: 0;
    }

    h1, h2, ul, p {
        color: green;
    }

    .greeting h1 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .message {
        width: 25%;
        
    }
</style>

<Menu {menuOpen} />

<div class="greeting">
    <h1>{greeting}, Analyst!</h1>
</div>

<div class="notification">
    <h2> <span class="material-symbols-outlined">notifications_active</span>
        Notifications 
    </h2>
</div>
<div class="message">
    {#each notifications as { message, unread}}
        <Notification {message} {unread} />
    {/each}
</div>

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