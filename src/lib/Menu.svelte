<script>
    import { navigateTo } from '../utils.js';
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { ChartPieSolid, ArrowRightToBracketOutline, BriefcaseSolid, ChartLineUpOutline, FileChartBarSolid, CogOutline, QuestionCircleOutline } from 'flowbite-svelte-icons';
    import { addLog } from '$lib/logStore.js'; // Import log function
    import user from '../user';

    let menuOpen = false;
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    $: activeUrl = $page.url.pathname;

    function toggleMenu() {
        menuOpen = !menuOpen;
        addLog(`Menu toggled: ${menuOpen ? 'Opened' : 'Closed'}`); // Log menu toggle state
    }

    function logNavigation(label, href) {
        addLog(`Navigating to ${label}`); // Log navigation event
        navigateTo(href);
    }
    
</script>

<div
  class={`fixed top-0 left-0 h-screen transition-transform transform bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg ${
    menuOpen ? 'translate-x-0' : '-translate-x-full'
  } opacity-100`}
>
    <div
    class="text-center text-xl font-bold py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-100"
    >
    INFILTR8
    </div>

    <Sidebar {activeUrl}>
        <SidebarWrapper>
            <SidebarGroup>
                <SidebarItem label="Dashboard" href="/dashboard" on:click={() => logNavigation('Dashboard', '/dashboard')}>
                    <svelte:fragment slot="icon">
                        <ChartPieSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Project Manager" href="/project" {spanClass} on:click={() => logNavigation('Project Manager', '/project')}>
                    <svelte:fragment slot="icon">
                        <BriefcaseSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Analysis" href="/analysis" {spanClass} on:click={() => logNavigation('Analysis', '/analysis')}>
                    <svelte:fragment slot="icon">
                        <ChartLineUpOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Reports" href="/report" {spanClass} on:click={() => logNavigation('Reports', '/report')}>
                    <svelte:fragment slot="icon">
                        <FileChartBarSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Settings" href="/settings" on:click={() => logNavigation('Settings', '/settings')}>
                    <svelte:fragment slot="icon">
                        <CogOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Support" href="/support" on:click={() => logNavigation('Support', '/support')}>
                    <svelte:fragment slot="icon">
                        <QuestionCircleOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Log Out" href="#" on:click={() => { 
                    navigateTo('/logout'); 
                }}>
                    <svelte:fragment slot="icon">
                        <ArrowRightToBracketOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
</div>

<button
  class={`fixed top-2 ${
    menuOpen ? 'left-56' : 'left-10'
  } z-10 p-2 text-black dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300`}
  on:click={toggleMenu}
>
  {#if menuOpen}
    <span class="material-symbols-outlined">chevron_left</span>
  {:else}
    <span class="material-symbols-outlined">chevron_right</span>
  {/if}
</button>
