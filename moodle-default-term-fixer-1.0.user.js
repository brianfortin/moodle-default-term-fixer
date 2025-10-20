// ==UserScript==
// @name         Moodle Default Term Fixer
// @match        https://moodle.colby.edu/my/*
// @run-at       document-idle
// @grant        none
// @version 1.0
// @author Brian Fortin
// @description changes the Moodle default selected term to the current one.
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_VALUE = "40"; // for Fall 2025: TARGET_VALUE = "40"

    function setDefaultTerm() {
        // find drop down menu
        const select = document.querySelector('#coc-filtercategory'); // '#coc-filtercategory' is the location of the target value
        // if dropdown does not exist, return
        if (!select) return;

        // find specific term option inside drop down menu
        const option = select.querySelector(`option[value="${TARGET_VALUE}"]`);
        // if specific term option does not exist, return
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
        console.log(`[Moodle Default Term] Applied value: ${TARGET_VALUE}`);
    }

    setDefaultTerm();
})();