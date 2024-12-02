<script>
	import Menu from '$lib/Menu.svelte';
	import { addLog } from '$lib/logStore.js';
	import { notifications } from '$lib/notificationStore.js';

	import { disallowedEntryPoints, disallowedIps } from '../../disallowedfilter';

	let entryPoints = [
		{ name: 'Unauthorized Port Bypass', selected: false },
		{ name: 'Default Credentials', selected: false },
		{ name: 'Unpatched Software Exploits', selected: false },
		{ name: 'Protocols Missing Encryption', selected: false },
		{ name: 'Weak Passwords', selected: false }
	];

	let menuOpen = false;
	let startTimes = ['08:00 AM'];
	let selectedStartTime = startTimes[0];
	let analysisProgress = 50; // Example progress value
	let overallProgress = 75; // Example overall progress value
	let analysisScheduled = false; // New flag for schedule analysis

	function handleEntryPointChange(index) {
		// Toggle the selected status of the entry point
		entryPoints[index].selected = !entryPoints[index].selected;
		const status = entryPoints[index].selected ? 'selected' : 'deselected';
		addLog(`Entry point "${entryPoints[index].name}" was ${status}`); // Log entry point change
	}

	async function scheduleAnalysis() {
		// Time format regex: HH:MM AM/PM
		const timePattern = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;

		// Check if the entered time format is valid
		if (!timePattern.test(selectedStartTime)) {
			addLog(`Invalid time format. Please use HH:MM AM/PM.`);
			return;
		}

		// Create Date objects for the current time and the entered start time
		const now = new Date();
		const startTime = new Date();

		// Extract hours, minutes, and period (AM/PM) from selectedStartTime
		const [hours, minutes, period] = selectedStartTime.split(/[: ]/);
		startTime.setHours(
			period === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12,
			minutes
		);

		// Calculate delay in milliseconds
		const delay = startTime - now;
		console.log(`Scheduled delay: ${delay} ms`);

		// Check if the scheduled time is in the future
		if (delay > 0) {
			setTimeout(initiateAnalysis, delay);
			notifications.update((n) => [
				...n,
				{ message: `Analysis scheduled for ${selectedStartTime}`, unread: true }
			]);
			addLog(`Analysis scheduled for ${selectedStartTime}`);
			analysisScheduled = true; // Flag for successfully scheduled analysis
		} else {
			addLog(`Invalid start time. Please select a future time.`);
		}
	}

	async function initiateAnalysis() {
		// Gather selected entry points
		const selectedEntryPoints = entryPoints.filter((entryPoint) => entryPoint.selected);

		// Log selected entry points or indicate none were selected
		if (selectedEntryPoints.length > 0) {
			const selectedNames = selectedEntryPoints.map((ep) => ep.name).join(', ');
			addLog(`Initiating analysis for selected entry points: ${selectedNames}`);
		} else {
			addLog(`No entry points selected. Initiating analysis.`);
		}

		// Placeholder for analysis logic
		await startAnalysis();
	}

	// Function to perform the actual analysis
	async function startAnalysis() {
		addLog('IM HERE in startAnaylsis');
		const ips = $disallowedIps;
		const entryPoints = $disallowedEntryPoints;

		const requestBody = JSON.stringify({ disallowedIps: ips, disallowedEntryPoints: entryPoints });

		console.log('Request body: ', requestBody);
		try {
			const response = await fetch('http://localhost:5001/start-analysis', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody
			});

			console.log('Response: ', response);

			if (!response.ok) {
				notifications.update((n) => [
					...n,
					{ message: `Network error, check logs.`, unread: true }
				]);
        addLog(`Network reponse error: ${response.statusText}`);
				throw new Error(`Network response error: ${response.statusText}`);
			} else {
				navigateTo('/report'); // Make sure navigateTo is defined correctly
			}
		} catch (error) {
			console.error('Error starting analysis: ', error);
		}
	}

	function viewResult() {
		const selectedEntryPoints = entryPoints.filter((entryPoint) => entryPoint.selected);
		if (selectedEntryPoints.length > 0) {
			const selectedNames = selectedEntryPoints.map((ep) => ep.name).join(', ');
			addLog(`Viewing results for selected entry points: ${selectedNames} at ${selectedStartTime}`); // Log result view
		} else {
			addLog(`No entry points selected. Viewing results at ${selectedStartTime}`); // Log result view with no selection
		}
		// Handle view result action
	}
</script>

<Menu {menuOpen} />

<div class="py-4 text-center">
	<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Schedule Analysis</h1>
</div>

<div class="flex min-h-[90vh] items-start justify-center bg-gray-100 pt-12 dark:bg-gray-900">
	<div
		class="mx-auto flex w-full max-w-5xl gap-10 rounded-lg border border-gray-300 bg-white p-10 shadow-lg dark:border-gray-700 dark:bg-gray-800"
	>
		<!-- Left Section: Entry Points and Start Time -->
		<div class="flex w-1/2 flex-col gap-8">
			<!-- Start Time Input -->
			<div
				class="rounded-lg border border-gray-300 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-700"
			>
				<label
					for="start-time-input"
					class="text-l mb-4 font-semibold text-gray-800 dark:text-gray-100"
				>
					<i class="fas fa-clock mr-2"></i> Enter Start Time (HH:MM AM/PM)
				</label>
				<input
					id="start-time-input"
					type="text"
					bind:value={selectedStartTime}
					placeholder="08:00 AM"
					class="w-full rounded-lg border-gray-300 bg-gray-100 p-2 text-gray-800 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
				/>
			</div>

			<!-- Schedule Analysis Button -->
			<button
				on:click={scheduleAnalysis}
				class="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md transition duration-300 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
			>
				{analysisScheduled ? 'Analysis Scheduled' : 'Schedule Analysis'}
			</button>
		</div>

		<!-- Test Results Section -->
		<div
			class="w-[45%] rounded-lg border border-gray-300 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-700"
		>
			<h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
				<i class="fas fa-chart-line mr-2"></i> Test Results
			</h2>
			<div class="mb-2 text-sm text-gray-800 dark:text-gray-300">Analysis Progress</div>
			<div class="mb-4 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600">
				<div class="h-2.5 rounded-full bg-green-500" style="width: {analysisProgress}%"></div>
			</div>

			<div class="mb-2 text-sm text-gray-800 dark:text-gray-300">Overall Progress</div>
			<div class="mb-4 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600">
				<div class="h-2.5 rounded-full bg-blue-500" style="width: {overallProgress}%"></div>
			</div>

			<div class="mb-8 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
				{overallProgress}% completed
			</div>

			<div class="flex justify-center">
				<button
					class="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
				>
					View Results
				</button>
			</div>
		</div>
	</div>
</div>
