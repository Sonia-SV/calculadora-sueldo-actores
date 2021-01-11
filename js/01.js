'use strict';

/*-----SELECTORS-----*/
const selects = document.querySelectorAll('select');
const numberInput = document.querySelector('.numberInput');

const partialResult = document.querySelector('.partialResult');
const totalResult = document.querySelector('.totalResult');
const contractType = document.querySelector('.contractType');

const warning = document.querySelector('.warning');
const lowBudgetWarning = document.querySelector('.lowBudgetWarning');
const iPWarning = document.querySelector('.iPwarning');

const sesionContract = document.querySelector('.sesionContract');
const monthContract = document.querySelector('.monthContract');
const weekContract = document.querySelector('.weekContract');

const resetButton = document.querySelector('.resetButton');

const renderContractProduction = document.getElementById('production');
const renderContractRole = document.getElementById('role');
const renderContractContract = document.getElementById('contract');
const renderContractDuration = document.getElementById('duration');

const contractInfo = {
};

const translation = {
  session: 'sesión',
  week: 'semana',
  month: 'mes',
}

/*-----GET DATA-----*/
const getUserValue = () => {
  contractInfo.production = renderContractProduction.value;
  contractInfo.role = renderContractRole.value;
  contractInfo.contract = renderContractContract.value;
  contractInfo.duration = parseFloat(renderContractDuration.value) < 1 ? 1 : parseFloat(renderContractDuration.value);
  renderContractDuration.value = contractInfo.duration < 1 ? 1 : contractInfo.duration;
  disabledOptions(contractInfo.production);
  paitWarnings();
  updateLocalStorage();
};

/*-----WARNINGS-----*/
const paitWarnings = () => {
  contractInfo.production !== 'all' && contractInfo.role !== 'all' ? renderResults(contractInfo.production, contractInfo.role, contractInfo.contract, contractInfo.duration) : renderReset();
  contractInfo.production === 'lowBudget' ? lowBudgetWarning.innerHTML = '* Películas para televisión o cine, telefims (TV movies) de hasta 750.000€ de presupuesto.  Están excluidas las series televisivas y sus capítulos.' : lowBudgetWarning.innerHTML = '';
}

const paintIPWarning = (salary) => {
  contractInfo.production !== 'commercial' ? iPWarning.innerHTML = `* Más ${salary}€ brutos en concepto de 5% de Derechos de Propiedad Intelectual.` : iPWarning.innerHTML = '';
}

const disabledOptions = (production) => {
  if (contractInfo.production === 'commercial') {
    monthContract.disabled = true;
    weekContract.disabled = true;
    sesionContract.selected = true;
  } else {
    weekContract.disabled = false;
    monthContract.disabled = false;
  }
};

/*-----PAINT RESULTS-----*/
const renderResults = (production, role, contract, duration) => {
  const salary = wages[production][role][contract];
  contractType.innerHTML = 'por ' + translation[contract];
  partialResult.innerHTML = salary + '€ brutos';
  const totalSalary = isNaN(duration) ? 1 * salary : duration * salary;
  totalResult.innerHTML = totalSalary.toFixed(2) + '€ brutos';
  warning.innerHTML = '';
  const iPAmount = totalSalary * 0.05;
  paintIPWarning(iPAmount.toFixed(2));
};

/*-----RESET-----*/
const renderReset = () => {
  contractType.innerHTML = 'parcial';
  partialResult.innerHTML = '-';
  totalResult.innerHTML = '-';
  warning.innerHTML = '(Introduce al menos tipo de produccion y papel para poder calcular tu salario)';
};

const handleReset = () => {
  selects.forEach((select) => (select.selectedIndex = 0));
  numberInput.value = '';
  renderReset();
  getUserValue();
};

/*-----LOCAL STORAGE-----*/
const updateLocalStorage = () => {
  localStorage.setItem('data', JSON.stringify(contractInfo));
};

const getFromLocalStorage = () => {
  const storedData = JSON.parse(localStorage.getItem('data'));
  if (storedData !== null) {
    console.log(storedData);
    contractInfo.production = storedData.production;
    contractInfo.role = storedData.role;
    contractInfo.contract = storedData.contract;
    contractInfo.duration = storedData.duration;
    renderContractProduction.value = storedData.production;
    renderContractRole.value = storedData.role;
    renderContractContract.value = storedData.contract;
    renderContractDuration.value = storedData.duration > 1 ? storedData.duration : 1;
    getUserValue();
  } else {
    renderContractDuration.value = 1;
  }
};

getFromLocalStorage();

selects.forEach((select) => select.addEventListener('change', getUserValue));
numberInput.addEventListener('input', getUserValue);
resetButton.addEventListener('click', handleReset);

