<script>
  import Menu from '$lib/Menu.svelte';
  import { logs, addLog } from '$lib/logStore.js';
  import { onMount } from 'svelte';

  let entryPoints = [
      { name: "Unauthorized Port Bypass", selected: false },
      { name: "Default Credentials", selected: false },
      { name: "Unpatched Software Exploits", selected: false },
      { name: "Protocols Missing Encryption", selected: false },
      { name: "Weak Passwords", selected: false }
  ];

  let menuOpen = false;
  let startTimes = ["08:00 AM", "12:00 PM", "04:00 PM"];
  let selectedStartTime = startTimes[0];
  let analysisProgress = 50;
  let overallProgress = 75;
  let logData = [];

  logs.subscribe(value => {
      logData = value;
  });

  function handleEntryPointChange(index) {
      entryPoints[index].selected = !entryPoints[index].selected;
      const status = entryPoints[index].selected ? 'selected' : 'deselected';
      addLog(`Entry point "${entryPoints[index].name}" was ${status}`);
  }

  function handleStartTimeChange(event) {
      selectedStartTime = event.target.value;
      addLog(`Start time changed to: ${selectedStartTime}`);
  }

  function viewResult() {
      const selectedEntryPoints = entryPoints.filter(entryPoint => entryPoint.selected);
      if (selectedEntryPoints.length > 0) {
          const selectedNames = selectedEntryPoints.map(ep => ep.name).join(', ');
          addLog(`Viewing results for selected entry points: ${selectedNames} at ${selectedStartTime}`);
      } else {
          addLog(`No entry points selected. Viewing results at ${selectedStartTime}`);
      }
  }

  function downloadLogs() {
      const logContent = logData.join('\n');
      const blob = new Blob([logContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'logs.log';
      link.click();
  }
</script>

<Menu {menuOpen} />

<div class="text-center py-4">
  <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Settings</h1>
</div>

<div class="flex justify-center items-start min-h-[90vh] pt-12 bg-gray-100 dark:bg-gray-900">
  <div class="flex gap-10 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-5xl w-full mx-auto">

    <!-- Left Section: Entry Points and Start Time -->
    <div class="flex flex-col gap-8 w-1/2">
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          <i class="fas fa-door-open mr-2"></i> Adjust Text Size
        </h2>
      </div>
    </div>

    <!-- Test Results Section -->
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-[45%]">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <i class="fas fa-chart-line mr-2"></i> Logs
      </h2>
      <button class="download-btn mt-4" on:click={downloadLogs}>
        <i class="fas fa-download mr-2"></i> Download Logs
      </button>
    </div>
  </div>
</div>

<style>
  .download-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: bold;
      background-color: #3b82f6; 
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .download-btn:hover {
      background-color: #2563eb; 
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  .download-btn:active {
      transform: scale(0.95);
  }

  .download-btn i {
      transition: transform 0.3s ease;
  }

  .download-btn:hover i {
      transform: translateX(4px);
  }
</style>


