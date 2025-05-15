"use strict";

let selectedData = null;

// PDF upload handling
const pdfInput = document.getElementById('pdf');
const pdfLabel = document.querySelector('#upload p');

// Function to process Bank of America PDF statement
async function processBankStatement(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const transactions = [];
        
        // Process each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');
            
            // Regular expressions to match Bank of America transaction patterns
            const transactionPattern = /(\d{2}\/\d{2}\/\d{2}|\d{2}\/\d{2})\s+(.*?)\s+([-]?\d+\.\d{2})/g;
            let match;

            while ((match = transactionPattern.exec(text)) !== null) {
                const description = match[2].trim();
                const amount = match[3];
                
                // Categorize transaction based on keywords
                let category = 'miscellaneous';
                if (description.match(/FOOD|RESTAURANT|CAFE|DOORDASH|UBER\s*EATS|GRUBHUB|TRADER|MARKET|SAFEWAY/i)) {
                    category = 'food';
                } else if (description.match(/TRANSPORT|UBER|LYFT|GAS|SHELL|CHEVRON|PARKING/i)) {
                    category = 'transportation';
                } else if (description.match(/RENT|UTILITIES|PG&E|WATER|ELECTRICITY|GEE/i)) {
                    category = 'rent and utilities';
                } else if (description.match(/INVESTMENT|STOCK|CRYPTO|ETF/i)) {
                    category = 'investments';
                } else if (description.match(/CREDIT|DISCOVER|CHASE|AMEX/i)) {
                    category = 'credit card';
                } else if (description.match(/NETFLIX|SPOTIFY|HULU|PRIME|SUBSCRIPTION/i)) {
                    category = 'subscriptions';
                }

                transactions.push({
                    description: description,
                    amount: amount,
                    category: category
                });
            }
        }

        return transactions;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
}

// Handle PDF file selection
pdfInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        pdfLabel.textContent = file.name;
        try {
            selectedData = await processBankStatement(file);
            console.log('Processed transactions:', selectedData);
        } catch (error) {
            alert('Error processing PDF file. Please make sure it\'s a valid Bank of America statement.');
            pdfLabel.textContent = 'no file chosen';
            selectedData = null;
        }
    } else {
        pdfLabel.textContent = 'no file chosen';
        selectedData = null;
    }
});

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
        // Hide first page
        firstPage.style.display = 'none';
        
        // Show results
        results.style.display = 'flex';
        results.classList.remove('disappear');
        
        // Show cards
        cards.style.display = 'flex';
        cards.classList.remove('disappear');
        cards.classList.remove('hidden');
        
        // Show legend
        legend.style.display = 'block';
        legend.classList.remove('disappear');
        legend.classList.remove('hidden');
        
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

                // Update text and calculations for this category
                const category = Object.keys(totals)[index];
                const categoryTotal = Object.values(totals)[index];
                result.innerHTML = `<h2>TOTAL SPENT:</h2> <h1>$${categoryTotal.toFixed(2)}</h1> <p>with the money you spent on ${category}, you could buy...</p>`;
                updateCards(categoryTotal);
            });
        
            item.addEventListener('mouseleave', () => {
                // Deactivate the chart segment and hide the tooltip
                pieChart.setActiveElements([]);
                pieChart.tooltip.setActiveElements([]);
                pieChart.update();

                // Reset text and calculations to total
                const totalSpent = Object.values(totals).reduce((acc, amt) => acc + amt, 0);
                const totalSpentFormatted = totalSpent.toFixed(2);
                result.innerHTML = `<h2>TOTAL SPENT:</h2> <h1>$${totalSpentFormatted}</h1> <p>with the money you spent this month, you could buy...</p>`;
                updateCards(totalSpent);
            });
        });
    };
});

// Back button functionality
const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
    // Hide results section completely
    results.style.display = 'none';
    results.classList.add('disappear');
    
    // Hide cards
    cards.style.display = 'none';
    cards.classList.add('disappear');
    cards.classList.add('hidden');
    
    // Hide legend
    legend.style.display = 'none';
    legend.classList.add('disappear');
    legend.classList.add('hidden');
    
    // Show first page
    firstPage.style.display = 'flex';
    firstPage.style.flexDirection = 'column';
    firstPage.style.alignItems = 'center';
    
    // Reset the pig and hammer
    pig.setAttribute('src', 'images/pig-sleep.PNG');
    hammer.classList.remove('showing');
    
    // Reset the form
    dropdown.selectedIndex = 0;
    pdfLabel.textContent = 'no file chosen';
    selectedData = null;
});