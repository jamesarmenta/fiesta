import { writable } from 'svelte/store';

export const dateRangeCount = writable(30);
export const selectedDatesMap = writable<Record <number, object>>({});