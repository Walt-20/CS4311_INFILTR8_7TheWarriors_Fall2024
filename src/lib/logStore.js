import { writable } from 'svelte/store';

export const logs = writable([]);

// Function to add logs into the store
export function addLog(message) {
    const timestamp = new Date().toISOString();
    logs.update((currentLogs) => [...currentLogs, `${timestamp} - ${message}`]);
}

// Function to clear logs from the store
export function clearLogs() {
    logs.set([]); // Reset logs to an empty array
}

// Function to get all logs as a formatted text
export function getAllLogs() {
    let logText = '';
    logs.subscribe((currentLogs) => {
        logText = currentLogs.join('\n'); // Join logs with newline characters
    })();
    return logText;
}
