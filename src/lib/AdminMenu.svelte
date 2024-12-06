<script>
    import { navigateTo } from '../utils.js';
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { ArrowRightToBracketOutline, CogOutline, UserCircleSolid, AddressBookSolid} from 'flowbite-svelte-icons';
    import { addLog } from '$lib/logStore.js'; // Import log function

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

<div class={`fixed top-0 left-0 h-screen transition-transform transform bg-gray-800 text-white ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div class="text-center text-xl font-bold py-4 bg-gray-700 dark:bg-gray-800">
        INFILTR8
    </div>

    <Sidebar {activeUrl}>
        <SidebarWrapper>
            <SidebarGroup>
                <SidebarItem label="Analyst Password Reset" href="/admin-dashboard" on:click={() => logNavigation('admin-dashboard', '/admin-dashboard')}>
                    <svelte:fragment slot="icon">
                        <AddressBookSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem
                    label="Update Admin Password"
                    href="/admin-update-password?username=admin"
                    on:click={() => logNavigation('admin-update-password', '/admin-update-password?username=admin')}>               
                    <svelte:fragment slot="icon">
                        <UserCircleSolid
                            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Settings" href="/admin-settings" on:click={() => logNavigation('Settings', '/admin-settings')}>
                    <svelte:fragment slot="icon">
                        <CogOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
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
    class={`fixed top-2 ${menuOpen ? 'left-56' : 'left-10'} z-10 p-2 text-black dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300`}
    on:click={toggleMenu}
>
    {#if menuOpen}
        <span class="material-symbols-outlined">chevron_left</span>
    {:else}
        <span class="material-symbols-outlined">chevron_right</span>
    {/if}
</button>
