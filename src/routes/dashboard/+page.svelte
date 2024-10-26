<script>
    import { onMount } from 'svelte';
    import Menu from '$lib/Menu.svelte';
    import Notification from '$lib/Notification.svelte';
    import { navigateTo } from '../../utils';
    import { BookOpenOutline } from 'flowbite-svelte-icons';
    import { addLog, logs } from '$lib/logStore.js';
    import { get } from 'svelte/store'; // To retrieve the logs
    
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
        greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
        addLog(`Greeting set to: ${greeting}`);
    });

    function handleFileSelect(event) {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter(file => file.name.endsWith(".nessus"));

        if (validFiles.length !== selectedFiles.length) {
            alert('Only .nessus files are allowed.');
            addLog('Invalid file type selected.');
        }

        files = validFiles;
        isValidFile = files.length > 0;
        addLog(`${files.length} valid files selected.`);
        handleShowProgress();

        if (isValidFile) {
            handleFileUpload(files[0]);
        }
    }

    async function handleFileUpload(file) {
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        console.log("handling file upload");

        const response = await fetch('http://localhost:5001/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error('File upload failed:', response.statusText);
            return;
        }

        const result = await response.text();
        console.log(result);
    }

    function handleCreateProject() {
        addLog('Creating project with selected files.');
        navigateTo('/project');
    }

    function handleDiscardAll() {
        files = [];
        uploadProgress = 0;
        addLog('All files discarded.');
    }

    function handleDrop(event) {
        event.preventDefault();
        const selectedFiles = Array.from(event.dataTransfer.files);
        const validFiles = selectedFiles.filter(file => file.name.endsWith(".nessus"));

        if (validFiles.length !== selectedFiles.length) {
            alert('Only .nessus files are allowed.');
            addLog('Invalid file type dropped.');
        }

        files = validFiles;
        isValidFile = files.length > 0;
        addLog(`${files.length} valid files dropped.`);
        handleShowProgress();
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleShowProgress() {
        uploadProgress = 0;
        const interval = setInterval(() => {
            uploadProgress += 10;
            if (uploadProgress >= 100) {
                clearInterval(interval);
                addLog('Upload completed.');
            }
        }, 100);
    }

    function downloadLogs() {
        const allLogs = get(logs).join('\n'); // Convert logs to string
        const blob = new Blob([allLogs], { type: 'text/plain' }); // Create Blob
        const url = URL.createObjectURL(blob); // Create URL for Blob

        // Create temporary link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Logs.log';
        a.click();
        URL.revokeObjectURL(url); // Clean up
    }
</script>

<Menu {menuOpen} />

<div class="text-center py-6">
    <h1 class="text-2xl font-semibold dark:text-gray-200">{greeting}, Analyst!</h1>
</div>

<div class="grid grid-cols-2 gap-6 p-6">
    <!-- Notifications Section -->
    <div class="notifications">
        <div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded shadow">
            <h2 class="text-xl font-bold flex items-center dark:text-gray-200">
                <span class="material-symbols-outlined mr-2">notifications_active</span>
                Notifications
            </h2>
        </div>

        <div class="bg-white dark:bg-gray-700 p-4 rounded shadow">
            {#each notifications as { message, unread }}
                <Notification {message} {unread} />
            {/each}
        </div>
    </div>

    <!-- Create New Project Section -->
    <div class="create-project">
        <div class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded shadow">
            <h2 class="text-xl font-bold flex items-center dark:text-gray-200">
                <BookOpenOutline class = "w-6 h-6 mr-2" /> 
                Create New Project
            </h2>
        </div>

        <!-- File Upload -->
        <div class="file-upload border-2 border-dashed border-gray-300 dark:border-gray-500 p-6 text-center rounded hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <div class="flex flex-col items-center justify-center space-y-4">
                <h2 class="text-m flex items-center dark:text-gray-200">
                    Drag and Drop a File Here Or
                </h2>
                
                <div class="relative inline-block">
                    <button type="button" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Select Files
                    </button>
                    <input id="file-input" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" type="file" multiple accept=".nessus" on:change={handleFileSelect} />
                </div>
            </div>
        </div>
    </div>

    <!-- Upload Files Section -->
    <div class="upload-files col-span-2 mt-6">
        <button 
            class="px-4 py-2 bg-blue-600 text-white rounded mr-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" 
            on:click={handleCreateProject} >
            Create Project
        </button>

        <button 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800" 
            on:click={handleDiscardAll}>
            Discard All
        </button>

        <h2 class="text-xl font-bold mt-6 dark:text-gray-200">Uploading Files</h2>

        {#if files.length > 0}
            <ul class="list-disc list-inside dark:text-gray-300 mt-2">
                {#each files as file}
                    <li>{file.name}</li>
                {/each}
            </ul>

            <!-- Progress Bar -->
            <div class="progress-bar bg-gray-200 rounded overflow-hidden mt-4">
                <div class="bg-green-500 h-2 rounded" style="width: {uploadProgress}%"></div>
            </div>
        {:else}
            <p class="mt-4 text-gray-600 dark:text-gray-300">No files being uploaded.</p>
        {/if}
    </div>

    <!-- New Download Logs Section -->
    <div class="download-logs">
        <button class="button" on:click={downloadLogs}>Download Logs</button>
    </div>
</div>