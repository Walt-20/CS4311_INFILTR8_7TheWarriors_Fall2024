<script>
  import Menu from '$lib/Menu.svelte';
  import { logs, addLog } from '$lib/logStore.js';
  import { onMount } from 'svelte';
  import { DarkMode } from 'flowbite-svelte';
  import { colorBlindMode } from '$lib/settingStore.js'; // Import the global store
  import { textSize } from '$lib/settingStore.js'; // Import the global store

  let menuOpen = false;
  let startTimes = ["08:00 AM", "12:00 PM", "04:00 PM"];
  let logData = [];

  logs.subscribe(value => {
    logData = value;
  });

  function downloadLogs() {
    const logContent = logData.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'logs.log';
    link.click();
  }

  function toggleColorBlindMode() {
		colorBlindMode.update(value => !value); // Toggle the mode
	}
</script>

<Menu {menuOpen} />

<div class={`text-center py-4 ${$colorBlindMode ? 'color-blind-background' : ''}`}>
  <h1 class={`text-4xl font-bold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-200'}`}>Settings</h1>
</div>

<div class={`flex justify-center items-start min-h-[90vh] pt-12 ${$colorBlindMode ? 'color-blind-bg-dark' : 'bg-gray-100 dark:bg-gray-900'}`}>
  <div class="flex gap-10 p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-5xl w-full mx-auto">

    <!-- Left Section: Adjust Text Size and Color Blind Mode -->
    <div class="flex flex-col gap-8 w-1/2">
      <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} flex-1 min-h-[100px]`}>
        <h2 class={`flex justify-center items-center text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
          <i class="fas fa-door-open mr-2"></i> Adjust Text Size
        </h2>
        <input type="range" min="12" max="24" bind:value={$textSize} class="w-full" />
        <span class="text-sm text-gray-500 dark:text-gray-300">Text Size: {$textSize}px</span>
      </div>

      <!-- Color Blind Mode Section -->
      <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} flex-1 min-h-[100px]`}>
        <h2 class={`flex justify-center items-center text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
          <i class="fas fa-eye mr-2"></i> Color Blind Mode
        </h2>
        <div class="flex justify-center items-center">
          <button class="color-blind-btn mt-4" on:click={toggleColorBlindMode}>
            <i class="fas fa-adjust mr-2"></i> Toggle Color Blind Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section: Download Logs -->
    <div class="flex flex-col gap-8 w-1/2">
      <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} flex-1 min-h-[100px]`}>
        <h2 class={`flex justify-center items-center text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
          <i class="fas fa-chart-line mr-2"></i> Logs
        </h2>
        <div class="flex justify-center">
          <button class="download-btn mt-4" on:click={downloadLogs}>
            <i class="fas fa-download mr-2"></i> Download Logs
          </button>
        </div>
      </div>
    
      <!-- Light & Dark Mode Section -->
      <div class={`p-6 rounded-lg shadow-md border ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'} flex-1 min-h-[100px]`}>
        <h2 class={`flex justify-center items-center text-xl font-semibold ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'} mb-4`}>
          <i class="fas fa-eye mr-2"></i> Light/Dark Mode
        </h2>
        <div class="flex justify-center items-center">
          <DarkMode class="transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600" />
        </div>
      </div>
      
    </div>
  </div>
</div>

<style>
  /* General Button Styling */
  .color-blind-btn, .download-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: bold;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: background-color 0.3s ease, transform 0.2s ease;
  }

  /*using IBM Colors */
  .color-blind-btn {
      background-color: #FF7F11; 
  }
  .color-blind-btn:hover {
      background-color: #FFA726; 
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  /*using IBM Colors */
  .download-btn {
      background-color: #3b82f6; 
  }
  .download-btn:hover {
      background-color: #2563eb; 
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }


  .color-blind-btn i, .download-btn i {
      transition: transform 0.3s ease;
  }
  .color-blind-btn:hover i, .download-btn:hover i {
      transform: translateX(4px);
  }

  .color-blind-background {
      background-color: #3C4C72; 
  }
  .color-blind-bg-dark {
      background-color: #273043; 
  }
  .color-blind-section {
      background-color: #F4A261; 
      border-color: #E76F51; 
  }
  .color-blind-text {
      color: #264653; 
  }
</style>





