<script>
    import { addLog } from '$lib/logStore.js'; // Import log store function

    let tests = ["Test 1", "Test 2", "Test 3"];
    let selectedTest = tests[0];
    let entryPoints = ["Entry Point 1", "Entry Point 2"];
    let selectedEntryPoint = entryPoints[0];
    let startTimes = ["08:00 AM", "12:00 PM", "04:00 PM"];
    let selectedStartTime = startTimes[0];
    let analysisProgress = 50; // Example progress value
    let overallProgress = 75; // Example overall progress value

    function handleTestChange(event) {
        selectedTest = event.target.value;
        addLog(`Test changed to: ${selectedTest}`); // Log test change
    }

    function handleEntryPointChange(event) {
        selectedEntryPoint = event.target.value;
        addLog(`Entry Point changed to: ${selectedEntryPoint}`); // Log entry point change
    }

    function handleStartTimeChange(event) {
        selectedStartTime = event.target.value;
        addLog(`Start Time changed to: ${selectedStartTime}`); // Log start time change
    }

    function viewResult() {
        addLog(`View Result clicked with Test: ${selectedTest}, Entry Point: ${selectedEntryPoint}, Start Time: ${selectedStartTime}`); 
        // Log view result action
    }
</script>

<Menu {menuOpen} />

<div class="text-center py-4">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200"> Schedule Analysis!</h1>
</div>

<!-- Entry Points Checklist -->
<div class="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4">Select Entry Points</h2>
  <div class="space-y-2">
    {#each entryPoints as entryPoint, index}
      <label class="flex items-center text-gray-800 dark:text-gray-300">
        <input type="checkbox" on:change={() => handleEntryPointChange(index)} checked={entryPoint.selected}
               class="mr-3 text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
        {entryPoint.name}
      </label>
    {/each}
  </div>
</div>

<!-- Start Time Dropdown -->
<div class="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
  <label for="start-time-select" class="block text-gray-800 dark:text-gray-300 mb-2">Start-Time</label>
  <select id="start-time-select" bind:value={selectedStartTime} on:change={handleStartTimeChange}
          class="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-30 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
    {#each startTimes as startTime}
      <option value={startTime} class="bg-gray-200 dark:bg-gray-700">{startTime}</option>
    {/each}
  </select>
</div>

<!-- Progress Bars -->
<div class="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
  <div class="text-gray-800 dark:text-gray-300 text-sm mb-2">Analysis Progress</div>
  <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
    <div class="bg-green-500 h-2.5" style="width: {analysisProgress}%"></div>
  </div>

  <div class="text-gray-800 dark:text-gray-300 text-sm mb-2">Overall Progress</div>
  <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
    <div class="bg-blue-500 h-2.5" style="width: {overallProgress}%"></div>
  </div>
  <div class="text-gray-800 dark:text-gray-300">{overallProgress}% completed</div>
</div>

<!-- View Result Button -->
<div class="flex justify-center items-center">
    <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 w-80 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" on:click={viewResult}>
    View Result
    </button>
</div>

<button on:click={viewResult}>View Result</button>
