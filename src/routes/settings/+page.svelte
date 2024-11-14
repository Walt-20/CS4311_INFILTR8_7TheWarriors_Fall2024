<script>
    import Menu from '$lib/Menu.svelte';
    import { addLog } from '$lib/logStore.js'; // Import log function
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
  let analysisProgress = 50; // Example progress value
  let overallProgress = 75; // Example overall progress value

  function handleEntryPointChange(index) {
      // Toggle the selected status of the entry point
      entryPoints[index].selected = !entryPoints[index].selected;
      const status = entryPoints[index].selected ? 'selected' : 'deselected';
      addLog(`Entry point "${entryPoints[index].name}" was ${status}`); // Log entry point change
  }

  function handleStartTimeChange(event) {
      selectedStartTime = event.target.value;
      addLog(`Start time changed to: ${selectedStartTime}`); // Log start time change
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
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Settings</h1>
</div>

<div class="flex justify-center items-start min-h-[90vh] pt-12 bg-gray-100 dark:bg-gray-900">
  <div class="flex gap-10 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-5xl w-full mx-auto">

    <!-- Left Section: Entry Points and Start Time -->
    <div class="flex flex-col gap-8 w-1/2">

      <!-- Select Entry Points -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          <i class="fas fa-door-open mr-2"></i> Adjust Text Size
        </h2>
      </div>
    </div>

    <!-- Test Results Section -->
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-[45%]">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <i class="fas fa-chart-line mr-2"></i> Download Logs
      </h2>
    </div>
  </div>
</div>

