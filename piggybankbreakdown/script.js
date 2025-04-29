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

// animate pig when hammer hits
const hammer = document.getElementById("hammer");
hammer.classList.remove('showing');
void hammer.offsetWidth;
const pig = document.getElementById('pig-sleep');

hammer.addEventListener('animationend', () => {
    pig.setAttribute('src', 'images/pig-smash.PNG')
});

const submit = document.getElementById('submit');
const firstPage = document.getElementById('first-page');
const results = document.getElementById('results');
const cards = document.getElementById('cards');
const legend = document.getElementById('legend');

// card update
const baconPrice = 0.68;
const paintbrushPrice = 1.27;
const insulinPrice = 130.00;
const footballPrice = 24.95;

function updateCards(totalSpent) {
    document.getElementById('bacon-text').innerText = `${Math.floor(totalSpent / baconPrice)} SLICES OF BACON`;
    document.getElementById('paintbrush-text').innerText = `${Math.floor(totalSpent / paintbrushPrice)} PAINTBRUSHES`;
    document.getElementById('insulin-text').innerText = `${Math.floor(totalSpent / insulinPrice)} INSULIN VIALS`;
    document.getElementById('football-text').innerText = `${Math.floor(totalSpent / footballPrice)} FOOTBALLS`;
}

submit.addEventListener('click', () => {
    if (selectedData) {
        hammer.classList.add('showing');
        setTimeout(resultDelay, 1200);
    }
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

    // hover handler
    const cardsPig = document.getElementsByClassName('card');
    const hoverPig = document.getElementsByClassName('hover');

    for (let i = 0; i < cardsPig.length; i++) {
        const card = cardsPig[i];
        const pig = hoverPig[i]; // Get the corresponding pig
    
        card.addEventListener('mouseover', function() {
            card.classList.add('scale');
            pig.classList.replace('hidden', 'showing');
        });
    
        card.addEventListener('mouseout', function() {
            card.classList.remove('scale');
            pig.classList.replace('showing', 'hidden');
        });
    }

    function resultDelay() {
        firstPage.style.display = 'none';
        results.classList.remove('disappear');
        cards.classList.remove('disappear');
        cards.classList.replace('hidden', 'showing');
        legend.classList.remove('disappear');
        legend.classList.replace('hidden', 'showing');
        
        // find total spent
        const totalSpent = Object.values(totals).reduce((acc, amt) => acc + amt, 0)
        updateCards(totalSpent);

        // format totalSpent
        const totalSpentFormatted = totalSpent.toFixed(2);
    
        result.innerHTML = `<h2>TOTAL SPENT:</h2> <h1>$${totalSpentFormatted}</h1> <p>with the money you spent this month, you could buy...</p>`;
    
        const pieCanvas = document.getElementById('pieChart');

        pieCanvas.width = window.innerWidth * 0.3;
        pieCanvas.height = window.innerWidth * 0.3;

        const ctx = document.getElementById('pieChart').getContext('2d');

        const pieChart = new Chart (ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(totals),
                datasets: [{
                    data: Object.values(totals),
                    backgroundColor: [
                         '#FF91A7', '#FFC5AD', '#FF9E91', '#CF85D6', '#FF80AC', '#FFC591', '#FEE7E4'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const value = tooltipItem.raw;
                                return `$${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
        
        const legendItems = document.querySelectorAll('#categories ul li');

        legendItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Activate the chart segment
                pieChart.setActiveElements([{ datasetIndex: 0, index }]);
                pieChart.update();
        
                // Show the tooltip by triggering it manually
                pieChart.tooltip.setActiveElements([{ datasetIndex: 0, index }]);
                pieChart.tooltip.update(true);
                pieChart.draw();
            });
        
            item.addEventListener('mouseleave', () => {
                // Deactivate the chart segment and hide the tooltip
                pieChart.setActiveElements([]);
                pieChart.tooltip.setActiveElements([]);
                pieChart.update();
            });
        });
    };
});