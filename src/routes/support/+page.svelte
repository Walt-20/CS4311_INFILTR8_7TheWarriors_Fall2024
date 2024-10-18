<script>
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { ChartPieSolid, BriefcaseSolid, ChartLineUpOutline, FileChartBarSolid, CogOutline, QuestionCircleOutline } from 'flowbite-svelte-icons';
 
    import { marked } from 'marked'
    export let data;
</script>
 
<div class="flex justify-end p-5">
    <div class="text-center py-4 max-w-lg">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Support</h1>
    
        <div class="text-blue-600 dark:text-blue-400">
            <div class="preview">{@html marked(data.file)}</div>
        </div>
    </div>
</div>