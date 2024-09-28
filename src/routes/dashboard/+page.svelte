<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import Notification from '$lib/Notification.svelte';
    import { navigateTo } from '../../utils';

    let greeting = '';
    let notifications = [
        { message: "Notification 1", unread: true }, 
        { message: "Notification 2", unread: false }, 
        { message: "Notification 3", unread: true }
    ];
    let files = [];
    let uploadProgress = 0;
    let menuOpen = false;
    let isValidFile = false;

    onMount(() => {
        const hours = new Date().getHours();
        if (hours < 12) {
            greeting = 'Good Morning';
        } else if (hours < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        console.log('Greeting set to:', greeting);
    });

    function handleFileSelect(event) {
        console.log('File selection triggered:', event);
        const allowedTypes = ['application/vdn.openxmlformats-officedocument.spreadsheetml.sheet'];
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter(file => file.name.endsWith(".nessus"));

        if (validFiles.length !== selectedFiles.length) {
            alert('Only .nessus files are allowed.');
            console.warn('Invalid file type selected.');
        }

        files = validFiles;
        isValidFile = files.length > 0;
        console.log('Valid files:', files);
        console.log('Is valid file:', isValidFile);
        handleShowProgress();

        handleFileUpload(files);
    }

    async function handleFileUpload(files) {
        const formData = new FormData();
        formData.append('file', files);
        console.log("handling file upload");

        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();
        console.log(result);
    }

    function handleCreateProject() {
        console.log('Creating project with files:', files);
        navigateTo('/project');
    }

    function handleDiscardAll() {
        console.log('Discarding all files.');
        files = [];
        uploadProgress = 0;
    }

    function handleDrop(event) {
        event.preventDefault();
        console.log('File drop event:', event);
        const allowedTypes = ['application/vdn.openxmlformats-officedocument.spreadsheetml.sheet'];
        const selectedFiles = Array.from(event.dataTransfer.files);
        const validFiles = selectedFiles.filter(file => file.name.endsWith(".nessus"));

        if (validFiles.length !== selectedFiles.length) {
            alert('Only .nessus files are allowed.');
            console.warn('Invalid file type dropped.');
        }

        files = validFiles;
        isValidFile = files.length > 0;
        console.log('Valid files after drop:', files);
        console.log('Is valid file after drop:', isValidFile);
        handleShowProgress();
    }

    function handleDragOver(event) {
        event.preventDefault();
        console.log('Drag over event:', event);
    }

    function handleShowProgress() {
        console.log('Starting upload progress...');
        uploadProgress = 0;
        const interval = setInterval(() => {
            uploadProgress += 10;
            console.log('Upload progress:', uploadProgress);
            if (uploadProgress >= 100) {
                console.log('Upload completed.');
                clearInterval(interval);
            }
        }, 100);
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
        <div class="file-upload"
             role="button"
             tabindex="0"
             aria-label="File upload area. Drag and drop a nuessus file here or select files using the button."
             on:dragover={handleDragOver}
             on:drop={handleDrop}>
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
        <button class="button" on:click={handleCreateProject} disabled={!isValidFile}>Create Project</button>
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

