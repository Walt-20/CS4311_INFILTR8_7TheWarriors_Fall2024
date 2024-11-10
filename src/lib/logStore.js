import { writable } from 'svelte/store';

export const logs = writable([]);

// Function to add logs into the store
export function addLog(message) {
    const timestamp = new Date().toISOString();
    logs.update((currentLogs) => [...currentLogs, `${timestamp} - ${message}`]);
}