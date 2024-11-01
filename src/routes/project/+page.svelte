<script>
    import Menu from '../../lib/Menu.svelte';

    let newIp = '';  // Stores the input for new IP
    let errorMessage = '';  // To store and display error messages

    let ips = ['10.31.112.29', '10.31.112.29'];
    let ipStatus = [];

    let entryPoints = ['missing encryption protocols', 'Unathenticated Port Bypass'];
    let projects = ["Project 1", "Project 2", "Project 3"];
    let menuOpen = false;

    let severity = ['1', '0'];

    let pluginName = ['Terminal Services Doesn\'t Use Network Level Authentication (NLA)', 'Terminal Services Use SSL/TLS']

    // Toggle IP status between 'allowed' and 'off-limits'
    function toggleStatus(index) {
        ipStatus[index] = ipStatus[index] === "Allowed" ? "Off-Limits" : "Allowed";
    }

    // Regular expression to validate an IP address with sections ranging 0-255
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;

    // Function to validate if the IP is in correct format (0-255 in all sections)
    function isValidIp(ip) {
        return ipRegex.test(ip);
    }

    // Function to add a new IP to the Scope IP list
    function addNewIp() {
        if (newIp.trim() === '') {
            errorMessage = 'IP address cannot be empty.';
        } else if (!isValidIp(newIp)) {
            errorMessage = 'Invalid IP address format.';
        } else if (ips.includes(newIp)) {
            errorMessage = 'IP already exists in the List.';
        } else {
            ips = [...ips, newIp];
            ipStatus = [...ipStatus, "allowed"]; // Default status for new IP
            newIp = '';  // Clear the input field
            errorMessage = '';  // Clear any previous error
        }
    }

    function moveUp(list, statusList, index) {
        if (index > 0) {
            const newList = [...list];
            const newStatusList = [...statusList];
            [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            [newStatusList[index - 1], newStatusList[index]] = [newStatusList[index], newStatusList[index - 1]];
            if (list === ips) {
                ips = newList;
                ipStatus = newStatusList;
            } else {
                entryPoints = newList;
            }
        }
    }

    function moveDown(list, statusList, index) {
        if (index < list.length - 1) {
            const newList = [...list];
            const newStatusList = [...statusList];
            [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
            [newStatusList[index + 1], newStatusList[index]] = [newStatusList[index], newStatusList[index + 1]];
            if (list === ips) {
                ips = newList;
                ipStatus = newStatusList;
            } else {
                entryPoints = newList;
            }
        }
    }

    // create function here to make a call to http://localhost:5001/results

    // this will give you back the json.

    // parse that json into two separate lists, one for ips and one for entry points 

    /* 
    
    * {
    *    "ip": "10.31.112.29",
    *    "archetype": "Other",
    *    "pluginName": "Nessus Scan Information"
    * },
    
    */

//    async function fetchResults() {
//     try {
//         const response = await fetch('http://localhost:5001/results');

//         if (!response.ok) {
//             throw new Error('Error, Network response: ', response);
//         }

//         const data = await response.json();

//         const inIps = [];
//         const inEntryPoints = [];

//         data.slice(0, 20).forEach(item => {
//             inIps.push(item.ip);
//             inEntryPoints.push(item.archetype);
//         });

//         ips = inIps;
//         entryPoints = inEntryPoints;
//         ipStatus = ips.map(() => "Allowed");
//     } catch (error) {
//         console.error('Error fetching results: ', error);
//     }
//    }

//    fetchResults();
</script>



<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas: "current-project load" "ip load" "entry load";
        grid-gap: 5px;
        padding: 5px;
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
        padding: 5px;
    }

    /*  I DONT LIKE THIS....Darien
    .scope-list:hover, .entry-list:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    */

    .scope-list ul, .entry-list ul {
        list-style-type: none;
        padding: 0;
    }

    .scope-list li, .entry-list li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }

    /*  Start of Add Darien  */
    input {
        margin-right: 10px;
    }

    button {
        margin-bottom: 10px;
    }

    .error {
        color: red;
    }

    .status-label {
        cursor: pointer;
        font-weight: bold;
    }

    .status-box {
        display: inline-block;
        width: 20px; /* Width of the box */
        height: 20px; /* Height of the box */
        margin-right: 1px; /* Space between box and IP */
        cursor: pointer; /* Pointer cursor to indicate clickable */
    }

    .allowed_box {
        background-color: #8BC34A;
        border: 1px solid #4CAF50;
    }

    .off-limits_box {
        background-color: #F44336;
        border: 1px solid #D32F2F;
    }

    .allowed {
        color: #8BC34A;
    }

    .off-limits {
        color: #F44336;
    }
    /*      End of Add Darien  */

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
        padding: 5px;
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
                            <!-- Clickable box for status -->
                            <span class="status-box"
                                on:click={() => toggleStatus(index)}
                                class:allowed_box={ipStatus[index] === "Allowed"}
                                class:off-limits_box={ipStatus[index] === "Off-Limits"}>
                            </span>
                            <span>{ip}</span>
                            <!-- Toggle status when clicked -->
                            <span class="status-label" 
                                class:allowed={ipStatus[index] === "Allowed"}
                                class:off-limits={ipStatus[index] === "Off-Limits"}>
                                {ipStatus[index]}
                            </span>
                            <div>
                                <span class="arrow" on:click={() => moveUp(ips, ipStatus, index)} aria-label="Move up"><span class="material-symbols-outlined">
                                    keyboard_arrow_up
                                    </span></span>
                                <span class="arrow" on:click={() => moveDown(ips, ipStatus, index)} aria-label="Move down"><span class="material-symbols-outlined">
                                    keyboard_arrow_down
                                    </span></span>
                            </div>
                        </li>
                    {/each}
                    <!-- Input field for Allowed IPs -->
                    <input type="text" bind:value={newIp} placeholder="Enter IP" />
                    <button on:click={addNewIp}>Add</button>
                </ul>
            </div>
            <!-- Error Message Display -->
            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
        </div>

        
        <div class="entry">
            <h2>Entry Points Allowed</h2>
            <div class="entry-list">
                <ul>
                    {#each entryPoints as entry, index}
                        <li>
                            <span>{entry}</span>
                            <div>
                                <span class="arrow" on:click={() => moveUp(entryPoints, index)} aria-label="Move up"><span class="material-symbols-outlined">
                                    keyboard_arrow_up
                                    </span></span>
                                <span class="arrow" on:click={() => moveDown(entryPoints, index)} aria-label="Move down"><span class="material-symbols-outlined">
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
        <button>Start Analysis</button>
    </div>
</div>
