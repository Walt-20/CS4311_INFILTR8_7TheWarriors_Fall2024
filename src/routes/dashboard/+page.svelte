<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import Notification from '$lib/Notification.svelte';

    let greeting = '';
    let notifications = [
        { message: "Notification 1", unread: true }, 
        { message: "Notification 2", unread: false }, 
        { message: "Notification 3", unread: true }
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
        uploadProgress = 0;
        const interval = setInterval(() => {
            uploadProgress += 10;
            if (uploadProgress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }

    function handleCreateProject() {
        // Handle create project action
    }

    function handleDiscardAll() {
        files = [];
        uploadProgress = 0;
    }

    function triggerFileInput() {
        document.getElementById('file-input').click();
    }
</script>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 20px;
        padding: 20px;
    }

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

    .message {
        background-color: rgba(83,109,130,255);
        border-radius: 1%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .notifications {
        grid-column: 1 / 2;
    }

    .create-project {
        grid-column: 2 / 3;
    }

    .upload-files {
        grid-column: 1 / 3;
    }

    h1, h2 {
        color: rgba(156,178,190,255);
    }

    .greeting h1 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button {
        background-color: rgba(156,178,190,255);
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
    }

    .button:hover {
        background-color: #5e6b72;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .button.discard {
        background-color: #b00020;
        color: #f3f3f3;
    }

    .button.discard:hover {
        background-color: #7f0000;
        color: #f3f3f3;
    }

    .file-input-container {
        position: relative;
        display: inline-block;
    }

    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

</style>

<Menu {menuOpen} />

<div class="greeting">
    <h1>{greeting}, Analyst!</h1>
</div>

<div class="grid">
    <div class="notifications">
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
    </div>
    
    <div class="create-project">
        <h2>Create New Project</h2>
        <div class="file-upload">
            <div class="top">
                <p>Drag and drop a file here or</p>
                <div class="file-input-container">
                    <button class="button" on:click{triggerFileInput}>Select Files</button>
                    <input id=:file-input class="file-input" type="file" multiple accept=".nessus" on:change={handleFileSelect} />
                </div>
            </div>
        </div>
    </div>
    
    <div class="upload-files">
        <button class="button" on:click={handleCreateProject}>Create Project</button>
        <button class="button discard" on:click={handleDiscardAll}>Discard all</button>
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
    </div>
</div>
