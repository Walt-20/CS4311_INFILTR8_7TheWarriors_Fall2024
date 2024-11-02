<script>
    import Menu from '$lib/Menu.svelte';
    import { marked } from 'marked';
    export let data;
    
    let menuOpen = false;
</script>

<Menu {menuOpen} />

<div class="text-center py-4">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Support</h1>
</div>

<div class="flex justify-center items-start min-h-[90vh] pt-12 bg-gray-100 dark:bg-gray-900">
  <div class="flex flex-col p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-3xl w-full mx-auto">

    <!-- Support Content -->
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <i class="fas fa-info-circle mr-2"></i> README Content
      </h2>
      <div class="text-gray-800 dark:text-gray-300 max-w-3xl">
        <div class="preview">{@html marked(data.file)}</div>
      </div>
    </div>
  </div>
</div>