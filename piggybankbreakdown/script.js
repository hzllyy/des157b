"use strict";

let selectedData = null;

const dropdown = document.getElementById('dropdown');
dropdown.addEventListener('change', async (e) => {
    const month = e.target.value;

    try {
        const response = await fetch(`bankstatements/${month}.json`);
        if (!response.ok) throw new Error("Couldn't load file");

        const data = await response.json();
        selectedData = data;

        console.log("loaded data from:", month, data);
    } catch (err) {
        console.error('error loading data:', err);
    }
});

const submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    if (!selectedData) {
        alert("Please select a month or upload a file first");
        return;
    }

    const result = document.getElementById('result');
    const totals = {};

    selectedData.forEach((entry) => {
        const category = entry.category;
        const amount = parseFloat(entry.amount);

        if (!totals[category]) {
            totals[category] = 0;
        }

        totals[category] += Math.abs(amount);
    });

    result.innerHTML = '<h3>Spending Breakdown</h3> <ul>' +
        Object.entries(totals)
        .map(([cat, amt]) => `<li><strong>${cat}</strong>: $${amt.toFixed(2)}</li>`)
        .join("") +
        `</ul>`;
});