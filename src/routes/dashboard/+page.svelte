<script>
	import { onMount } from 'svelte';
	import Menu from '$lib/Menu.svelte';
	import { notifications } from '$lib/notificationStore.js';
	import { navigateTo } from '../../utils';
	import { BookOpenOutline } from 'flowbite-svelte-icons';
	import { addLog, logs } from '$lib/logStore.js';
	import { get, writable } from 'svelte/store'; // To retrieve the logs
	import { fly } from 'svelte/transition';

	let greeting = '';
	let projects = [];
	let files = [];
	let uploadedfiles = []; //Array of paths to files that have been uploaded
	let uploadProgress = 0;
	let menuOpen = false;
	let isValidFile = false;
	let serverResponse = null;
	let showToast = false;
	let showPopup = writable(false);
	let projectName = '';

	export let data;
	const userId = data.user.username;

	onMount(() => {
		const hours = new Date().getHours();
		greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
		addLog(`Greeting set to: ${greeting}`);
	});

	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		const validFiles = selectedFiles.filter((file) => file.name.endsWith('.nessus'));

		if (validFiles.length !== selectedFiles.length) {
			alert('Only .nessus files are allowed.');
			addLog('Invalid file type selected.');
		}

		files = validFiles;
		isValidFile = files.length > 0;
		addLog(`${files.length} valid files selected.`);
		handleShowProgress();
	}

	// Added this - Darien  ///////////////////////
	async function uploadFileToServer(file) {
		serverResponse = null;
		showToast = false;
		console.log('uploading files');
		const formData = new FormData();
		formData.append('userId', userId);
		formData.append('projectName', projectName);
		formData.append('files', file);

		try {
			const response = await fetch('http://localhost:5001/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				serverResponse = `CSV file generated: ${result.message}`;
				let uploadedfilepath = result.filepath;
				uploadedfiles.push(uploadedfilepath);
			} else {
				serverResponse = 'File upload failed';
				addLog(`Failed to upload file for ${projectName}, ${uploadedfilepath}`)
			}
			showToast = true;
			setTimeout(() => (showToast = false), 3000);
			fetchUploadedFiles(userId);
		} catch (error) {
			notifications.update((n) => [
				...n,
				{ message: `Error uploading file, check logs`, unread: true }
			]);
			addLog(`Error uploading file: ${error}`);
			console.error('Error uploading file:', error);
		}
	}

	function handleCreateProject() {
		console.log('Project Name', projectName);
		if (isValidFile) {
			console.log('Truly a valid file');
			// Upload the file to the server for parsing
			files.forEach((file) => uploadFileToServer(file));

			notifications.update((n) => [
				...n,
				{ message: `Project "${projectName}" created successfully.`, unread: true }
			]);
		}
		addLog('Creating project with selected files.');
		navigateTo('/project');
	}

	function handleDiscardAll() {
		files = [];
		uploadedfiles.forEach(async (filepath) => {
			try {
				const response = await fetch('http://localhost:5001/discard', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ filepath: filepath, userId: 1111111 })
				});

				if (!response.ok) {
					notifications.update((n) => [
						...n,
						{ message: `Error discarding file(s), check logs`, unread: true }
					]);
					addLog(`Error discarding files ${response.statusText}`);
					throw new Error('Error discard files');
				}
			} catch (error) {
				addLog(`Error discarding files: ${error}`)
				console.error('Error discarding files: ', error);
			}
		});
		uploadProgress = 0;
		addLog('All files discarded.');
	}

	function handleDrop(event) {
		event.preventDefault();
		const selectedFiles = Array.from(event.dataTransfer.files);
		const validFiles = selectedFiles.filter((file) => file.name.endsWith('.nessus'));

		if (validFiles.length !== selectedFiles.length) {
			alert('Only .nessus files are allowed.');
			addLog('Invalid file type dropped.');
		}

		files = validFiles;
		isValidFile = files.length > 0;
		addLog(`${files.length} valid files dropped.`);
		handleShowProgress();

		if (isValidFile) {
			files.forEach((file) => uploadFileToServer(file));
		}
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

	async function fetchUploadedFiles(userId) {
		if (!userId) {
			return;
		}
		const stringifyedUserId = String(userId);
		console.log(stringifyedUserId);
		try {
			const response = await fetch('http://localhost:5001/user-projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId: stringifyedUserId })
			});

			if (!response.ok) {
				notifications.update((n) => [
					...n,
					{ message: `Failed to fetch projects, check logs`, unread: true }
				]);
				addLog(`Failed to fetch projects, Network error`);
				throw new Error('Failed to fetch projects');
			}

			const serverProjects = await response.json();
			projects = serverProjects.map((project) => project.projectName);
		} catch (error) {
			notifications.update((n) => [
				...n,
				{ message: `Error communicating with server, check logs`, unread: true }
			]);
			addLog(`Network Error, failed to fetch projects: ${error}`)
			console.error('Error fetching projects: ', error);
		}
	}

	fetchUploadedFiles(userId);
</script>

<Menu {menuOpen} />

<div class="py-6 text-center">
	<h1 class="text-2xl font-semibold dark:text-gray-200">{greeting}, Analyst!</h1>
</div>

<div class="grid grid-cols-2 gap-6 p-6">
	<!-- Create New Project Section -->
	<div class="create-project">
		<div class="mb-4 rounded bg-gray-50 p-4 shadow dark:bg-gray-700">
			<h2 class="flex items-center text-xl font-bold dark:text-gray-200">
				<BookOpenOutline class="mr-2 h-6 w-6" />
				Create New Project
			</h2>
		</div>

		<div class="flex items-center space-x-20">
			<div class="popup">
				<input
					type="text"
					id="projectName"
					bind:value={projectName}
					placeholder="Project Name"
					class="mt-1 block w-full rounded border p-2"
				/>
			</div>
			<button
				class="mr-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-blue-800"
				on:click={handleCreateProject}
				disabled={!isValidFile && projectName != null}
			>
				Create Project
			</button>
			<button
				class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
				on:click={handleDiscardAll}
			>
				Discard All
			</button>
		</div>
		<br />

		<!-- File Upload -->
		<div
			class="file-upload cursor-pointer rounded border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:hover:bg-gray-600"
		>
			<div class="flex flex-col items-center justify-center space-y-4">
				<h2 class="text-m flex items-center dark:text-gray-200">Drag and Drop a File Here Or</h2>

				<div class="relative inline-block">
					<button
						type="button"
						class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						on:click={() => document.getElementById('file-input').click()}
					>
						Select Files
					</button>
					<input
						id="file-input"
						class="hidden"
						type="file"
						multiple
						accept=".nessus"
						on:change={handleFileSelect}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Project Section -->
	<div class="projects">
		<div class="mb-4 rounded bg-gray-50 p-4 shadow dark:bg-gray-700">
			<h2 class="flex items-center text-xl font-bold dark:text-gray-200">
				<span class="material-symbols-outlined mr-2">folder</span>
				Projects
			</h2>
		</div>
		<div class="rounded bg-white p-4 shadow dark:bg-gray-700">
			{#if projects.length === 0}
				<p>No Projects Available</p>
			{:else}
				{#each projects as project}
					<h2
						class="text-md mb-2 flex transform cursor-pointer items-center font-bold transition hover:scale-105 hover:shadow-xl dark:text-gray-200"
					>
						<span class="mr-4">📁</span>
						<a href="./project/{project}">{project}</a>
					</h2>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Toast Notification for server response -->
	{#if showToast}
		<div class="fixed bottom-4 right-4 rounded bg-white p-4 shadow-lg" in:fly={{ y: 200 }}>
			<p>{serverResponse}</p>
		</div>
	{/if}

	<!-- Upload Files Section -->
	<div class="upload-files col-span-2 mt-6">
		{#if files.length > 0}
			<ul class="mt-2 list-inside list-disc dark:text-gray-300">
				{#each files as file}
					<li>{file.name}</li>
				{/each}
			</ul>

			<!-- Progress Bar -->
			<div class="progress-bar mt-4 overflow-hidden rounded bg-gray-200">
				<div class="h-2 rounded bg-green-500" style="width: {uploadProgress}%"></div>
			</div>
		{:else}
			<p class="mt-4 text-gray-600 dark:text-gray-300">No files being uploaded.</p>
		{/if}
	</div>
</div>
