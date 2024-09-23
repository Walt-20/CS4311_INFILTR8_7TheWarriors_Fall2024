<script>
    import Menu from '../../lib/Menu.svelte';

    let ips = ["192.168.1.1", "192.168.1.2", "192.168.1.3"];
    let analyses = ["Analysis 1", "Analysis 2", "Analysis 3"];
    let projects = ["Project 1", "Project 2", "Project 3"];
    let menuOpen = false;

    function moveUp(list, index) {
        if (index > 0) {
            const newList = [...list];
            [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            if (list === ips) {
                ips = newList;
            } else {
                analyses = newList;
            }
        }
    }

    function moveDown(list, index) {
        if (index < list.length - 1) {
            const newList = [...list];
            [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
            if (list === ips) {
                ips = newList;
            } else {
                analyses = newList;
            }
        }
    }
</script>



<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas: "current-project load" "ip load" "entry load";
        grid-gap: 20px;
        padding: 20px;
    }

    .current-project {
        grid-area: current-project;
        display: flex;
        width: 50%;
        align-items: center;
        padding: 10px;
        background-color: rgba(83,109,130,255);
        color: #fff;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        cursor: pointer;
    }

    .current-project:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .folder-icon {
        margin-right: 10px;
        font-size: 2rem;
        display: flex;
        align-items: center;
    }

    .button-text {
        margin-top: .75rem;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    .ip {
        grid-area: ip;
    }

    .scope-list, .entry-list {
        background-color: rgba(83,109,130,255);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 75%;
        padding: 10px;
    }

    .scope-list:hover, .entry-list:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .scope-list ul, .entry-list ul {
        list-style-type: none;
        padding: 0;
    }

    .scope-list li, .entry-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }

    .load-projects ul {
        list-style-type: none;
        padding: 0;
    }

    .project-card {
        display: flex;
        align-items: center;
        padding: 20px;
        margin: 20px 0;
        border-radius: 5px;
        background-color: rgba(83,109,130,255);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .project-card:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .project-card .icon {
        margin-right: 10px;
    }

    .entry {
        grid-area: entry;
    }

    .load {
        grid-area: load;
        justify-self: end;
    }

    .main {
        padding: 20px;
    }

    .arrow {
        cursor: pointer;
        margin-left: 10px;
    }

    .start-testing {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .start-testing button {
        padding: 10px 20px;
        background-color: rgba(83,109,130,255);
        color: #fff;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        cursor: pointer;
    }

    .start-testing button:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    
</style>

<Menu {menuOpen} />

<div class="main">

    <h2>Current Project Folder</h2>

    <div class="grid">

        <button class="current-project">
            <div class="folder-icon">📁</div>
            <div class="button-text">
                <span>Go to Current</span>
                <span>Project Folder</span>
            </div>
        </button>
        
        <div class="ip">
            <h2>Scope IP List</h2>
            <div class="scope-list">
                <ul>
                    {#each ips as ip, index}
                        <li>
                            <span>{ip}</span>
                            <div>
                                <span class="arrow" on:click={() => moveUp(ips, index)} aria-label="Move up"><span class="material-symbols-outlined">
                                    keyboard_arrow_up
                                    </span></span>
                                <span class="arrow" on:click={() => moveDown(ips, index)} aria-label="Move down"><span class="material-symbols-outlined">
                                    keyboard_arrow_down
                                    </span></span>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        
        <div class="entry">
            <h2>Entry Points Allowed</h2>
            <div class="entry-list">
                <ul>
                    {#each analyses as analysis, index}
                        <li>
                            <span>{analysis}</span>
                            <div>
                                <span class="arrow" on:click={() => moveUp(analyses, index)} aria-label="Move up"><span class="material-symbols-outlined">
                                    keyboard_arrow_up
                                    </span></span>
                                <span class="arrow" on:click={() => moveDown(analyses, index)} aria-label="Move down"><span class="material-symbols-outlined">
                                    keyboard_arrow_down
                                    </span></span>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        
        <div class="load">
            <h2>Load Projects</h2>
            <div class="load-projects">
                <ul>
                    {#each projects as project}
                        <li class="project-card">
                            <span class="icon">📁</span>
                            <span>{project}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <div class="start-testing">
        <button>Start Testing</button>
    </div>
</div>

