import { Input } from "postcss";
import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');

let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(value) {
    return value.toFixed(2);
}

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        return;
    }

    resetChart();

    const startingAmount = Number(document.getElementById('starting-amount').value.replace(",", "."));
    const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(",", "."));
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value.replace(",", "."));
    const returnRatePeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value.replace(",", "."));

    const returnArray = generateReturnsArray(startingAmount, timeAmount, timeAmountPeriod, additionalContribution, returnRate, returnRatePeriod, taxRate);

    const finalInvestmentObject = returnArray[returnArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: ["Total investido", "Rendimento", "Imposto"],
            datasets: [{
                data: [
                    formatCurrency(finalInvestmentObject.investedAmount),
                    formatCurrency(finalInvestmentObject.totalInterestReturn * (1 - taxRate / 100)),
                    formatCurrency(finalInvestmentObject.totalInterestReturn * (taxRate / 100))
                ],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        },
    });

    progressionChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnArray.map((investmentObject) => investmentObject.month),
            datasets: [{
                label: "Total Investido",
                data: returnArray.map((investmentObject) =>
                    formatCurrency(investmentObject.investedAmount)
                ),
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: "Retorno do Investimento",
                data: returnArray.map((investmentObject) =>
                    formatCurrency(investmentObject.interestReturns)
                ),
                backgroundColor: 'rgb(54, 162, 235)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true },
            }
        }
    });
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetChart() {
    if (!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChartReference)) {
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

function clearForm() {
    for (const formElement of form.elements) {  // Correto
        if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
            formElement.value = '';
        }
    }
    resetChart();

    const errorInputContainers = document.querySelectorAll('.error');
    for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error');
        errorInputContainer.parentElement.querySelector('p').remove();
    }
}

function validateInput(evt) {
    if (evt.target.value === '') {
        return;
    }
    const { parentElement } = evt.target;
    const grandParentElement = evt.target.parentElement.parentElement;
    const inputValue = evt.target.value.replace(",", ".");

    if (!parentElement.classList.contains("error") && (isNaN(inputValue) || Number(inputValue) <= 0)) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = 'Insira um valor numérico e maior que zero';

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);

    } else if (parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

for (const formElement of form.elements) {  // Correto
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput);
    }
}

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
