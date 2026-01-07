// ==UserScript==
// @name         Moodle Default Term Fixer
// @match        https://moodle.colby.edu/my/*
// @run-at       document-idle
// @grant        none
// @version 1.3
// @author Brian Fortin
// @description Changes Moodle's default selected term to the current one.
// ==/UserScript==

(function () {
    'use strict';

    // TARGET_VALUE options:
    // 37: Fall 2024
    // 38: JanPlan 2025
    // 39: Spring 2025
    // 40: Fall 2025
    // 43: JanPlan 2026
    // possible future values
    // 44: Spring 2026
    // et cetera

    // time periods
    // .getTime() converts values to ms, which can then be compared to Date.now()
    const periods = [
        { value: 39, start: new Date("2025-01-29").getTime(), end: new Date("2025-05-31").getTime(), extrapolated: false }, // Spring 2025
        { value: 40, start: new Date("2025-06-01").getTime(), end: new Date("2025-12-20").getTime(), extrapolated: false }, // Fall 2025
        // extrapolated guesses
        { value: 43, start: new Date("2025-12-21").getTime(), end: new Date("2026-01-28").getTime(), extrapolated: true }, // JanPlan 2026
        { value: 44, start: new Date("2026-01-29").getTime(), end: new Date("2026-05-31").getTime(), extrapolated: true }, // Spring 2026
        { value: 45, start: new Date("2026-06-01").getTime(), end: new Date("2026-12-20").getTime(), extrapolated: true }, // Fall 2026
        { value: 48, start: new Date("2026-12-21").getTime(), end: new Date("2027-01-28").getTime(), extrapolated: true }, // JanPlan 2027
        { value: 49, start: new Date("2027-01-29").getTime(), end: new Date("2027-06-01").getTime(), extrapolated: true }, // Spring 2027
    ];

    // get time
    const now = Date.now();

    // find matching time period
    const currentPeriod = periods.find(p => now >= p.start && now <= p.end);

    // throw error if time not added
    if (!currentPeriod) {
        throw new Error(`[Moodle Default Term Fixer EXTENSION] TARGET_VALUE not found within list. Add the value to the variable "periods" (e.g., 39 = Spring 2025).`);
    }

    // set target value based on matching time period
    const TARGET_VALUE = currentPeriod.value;

    function setDefaultTerm() {
        // find drop down menu
        const select = document.querySelector('#coc-filtercategory'); // '#coc-filtercategory' is the location of the target value
        // if dropdown does not exist, return
        if (!select) return;

        // find specific term option inside drop down menu
        const option = select.querySelector(`option[value="${TARGET_VALUE}"]`);
        // if specific term option does not exist, return
        if (!option && currentPeriod.extrapolated) {
            throw new Error(`[Moodle Default Term Fixer EXTENSION] Extrapolated guess for value ${TARGET_VALUE} not found in dropdown.`)
        }
        if (!option) return;

        // set dropdown's selection to target value
        select.value = TARGET_VALUE;

        // remove the 'selected' attribute from all options to clear any existing selection
        select.querySelectorAll('option').forEach(opt => opt.removeAttribute('selected'));

        // mark the target option as the newly selected one
        // 'selected' is defined as a standard HTML attribute
        option.setAttribute('selected', 'selected'); // ('name', 'value')

        // send a change event to page
        select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        // print
        console.log(`[Moodle Default Term Fixer EXTENSION] Applied value: ${TARGET_VALUE}.`);
    }

    setDefaultTerm();
})();
