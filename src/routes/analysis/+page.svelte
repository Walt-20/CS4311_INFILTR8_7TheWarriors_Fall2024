<script>
    import Menu from '$lib/Menu.svelte';
    import { addLog } from '$lib/logStore.js'; // Import log function

    import {disallowedEntryPoints,disallowedIps} from '../../disallowedfilter';

    let entryPoints = [
        { name: "Unauthorized Port Bypass", selected: false },
        { name: "Default Credentials", selected: false },
        { name: "Unpatched Software Exploits", selected: false },
        { name: "Protocols Missing Encryption", selected: false },
        { name: "Weak Passwords", selected: false }
    ];

  let menuOpen = false;
  let startTimes = ["08:00 AM"];
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
    startTime.setHours((period === "PM" ? parseInt(hours) % 12 + 12 : parseInt(hours) % 12), minutes);

    // Calculate delay in milliseconds
    const delay = startTime - now;
    console.log(`Scheduled delay: ${delay} ms`);

    // Check if the scheduled time is in the future
    if (delay > 0) {
        setTimeout(initiateAnalysis, delay);
        addLog(`Analysis scheduled for ${selectedStartTime}`);
        analysisScheduled = true; // Flag for successfully scheduled analysis
    } else {
        addLog(`Invalid start time. Please select a future time.`);
    }
}

async function initiateAnalysis() {
    // Gather selected entry points
    const selectedEntryPoints = entryPoints.filter(entryPoint => entryPoint.selected);
    
    // Log selected entry points or indicate none were selected
    if (selectedEntryPoints.length > 0) {
        const selectedNames = selectedEntryPoints.map(ep => ep.name).join(', ');
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
            throw new Error(`Network response error: ${response.statusText}`);
        } else {
            navigateTo('/report'); // Make sure navigateTo is defined correctly
        }
    } catch (error) {
        console.error('Error starting analysis: ', error);
    }
}

  function viewResult() {
      const selectedEntryPoints = entryPoints.filter(entryPoint => entryPoint.selected);
      if (selectedEntryPoints.length > 0) {
          const selectedNames = selectedEntryPoints.map(ep => ep.name).join(', ');
          addLog(`Viewing results for selected entry points: ${selectedNames} at ${selectedStartTime}`); // Log result view
      } else {
          addLog(`No entry points selected. Viewing results at ${selectedStartTime}`); // Log result view with no selection
      }
      // Handle view result action
  }
</script>

<Menu {menuOpen} />

<div class="text-center py-4">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200"> Schedule Analysis</h1>
</div>

<div class="flex justify-center items-start min-h-[90vh] pt-12 bg-gray-100 dark:bg-gray-900">
  <div class="flex gap-10 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-5xl w-full mx-auto">

    <!-- Left Section: Entry Points and Start Time -->
    <div class="flex flex-col gap-8 w-1/2">

      <!-- Start Time Input -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <label for="start-time-input" class="text-l font-semibold text-gray-800 dark:text-gray-100 mb-4">
          <i class="fas fa-clock mr-2"></i> Enter Start Time (HH:MM AM/PM)
        </label>
        <input 
          id="start-time-input" 
          type="text" 
          bind:value={selectedStartTime} 
          placeholder="08:00 AM"
          class="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Schedule Analysis Button -->
      <button on:click={scheduleAnalysis} class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 mt-4 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 transition duration-300">
        {analysisScheduled ? 'Analysis Scheduled' : 'Schedule Analysis'}
      </button>

    </div>

    <!-- Test Results Section -->
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-[45%]">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <i class="fas fa-chart-line mr-2"></i> Test Results
      </h2>
      <div class="text-gray-800 dark:text-gray-300 text-sm mb-2">Analysis Progress</div>
      <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
        <div class="bg-green-500 h-2.5 rounded-full" style="width: {analysisProgress}%"></div>
      </div>

      <div class="text-gray-800 dark:text-gray-300 text-sm mb-2">Overall Progress</div>
      <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
        <div class="bg-blue-500 h-2.5 rounded-full" style="width: {overallProgress}%"></div>
      </div>

      <div class="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
        {overallProgress}% completed
      </div>

      <div class="flex justify-center">
        <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300">
          View Results
        </button>
      </div>
    </div>
  </div>
</div>