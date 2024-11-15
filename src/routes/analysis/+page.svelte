<script>
  import Menu from '$lib/Menu.svelte';
  import { addLog } from '$lib/logStore.js';
  import { colorBlindMode } from '$lib/settingStore.js'; // Import the colorBlindMode store

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
      const selectedNames = selectedEntryPoints.map(ep => ep.name).join(', ');
      addLog(`Viewing results for selected entry points: ${selectedNames || 'No entry points selected'} at ${selectedStartTime}`);
  }
</script>

<Menu {menuOpen} />

<div class={`text-center py-4 ${$colorBlindMode ? 'color-blind-background' : ''}`}>
  <h1 class={`text-4xl font-bold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-200'}`}>Schedule Analysis</h1>
</div>

<div class={`flex justify-center items-start min-h-[90vh] pt-12 ${$colorBlindMode ? 'color-blind-bg-dark' : 'bg-gray-100 dark:bg-gray-900'}`}>
  <div class="flex gap-10 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-5xl w-full mx-auto">

      <!-- Left Section: Entry Points and Start Time -->
      <div class="flex flex-col gap-8 w-1/2">

          <!-- Select Entry Points -->
          <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
              <h2 class={`text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
                  <i class="fas fa-door-open mr-2"></i> Select Entry Points
              </h2>
              <div class="space-y-4">
                  {#each entryPoints as entryPoint, index}
                      <label class={`flex items-center ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-300'}`}>
                          <input 
                              type="checkbox" 
                              on:change={() => handleEntryPointChange(index)} 
                              checked={entryPoint.selected}
                              class="mr-3 text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                              style="width: 18px; height: 18px;" 
                          />
                          {entryPoint.name}
                      </label>
                  {/each}
              </div>
          </div>

          <!-- Start Time Dropdown -->
          <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
              <label for="start-time-select" class={`block ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-300'} mb-2`}>
                  <i class="fas fa-clock mr-2"></i> Start-Time
              </label>
              <select 
                  id="start-time-select" 
                  bind:value={selectedStartTime} 
                  on:change={handleStartTimeChange}
                  class={`bg-gray-100 ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800'} border-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500`}>
                  {#each startTimes as startTime}
                      <option value={startTime} class="bg-white dark:bg-gray-700">{startTime}</option>
                  {/each}
              </select>
          </div>
      </div>

      <!-- Test Results Section -->
      <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} w-[45%]`}>
          <h2 class={`text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
              <i class="fas fa-chart-line mr-2"></i> Test Results
          </h2>
          <div class={`${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-300'} text-sm mb-2`}>Analysis Progress</div>
          <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
              <div class="bg-green-500 h-2.5 rounded-full" style="width: {analysisProgress}%"></div>
          </div>

          <div class={`${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-300'} text-sm mb-2`}>Overall Progress</div>
          <div class="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-4">
              <div class="bg-blue-500 h-2.5 rounded-full" style="width: {overallProgress}%"></div>
          </div>

          <div class={`text-lg font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} text-center mb-8`}>
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

<style>
  /* Color Blind Mode Styling */
  .color-blind-background {
      background-color: #3C4C72; /* High-contrast background */
  }
  .color-blind-bg-dark {
      background-color: #273043; /* Dark high-contrast background */
  }
  .color-blind-section {
      background-color: #F4A261; /* Light orange for sections */
      border-color: #E76F51; /* Border with contrast */
  }
  .color-blind-text {
      color: #264653; /* Dark text color with high contrast */
  }
</style>


