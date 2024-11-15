import { writable } from "svelte/store";
 
export const disallowedIps = writable([]);
export const disallowedEntryPoints = writable([]);