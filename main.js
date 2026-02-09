const state = {
    bill: '',
    people: '',
    tipPercent: '',
    activeTipBtn: null,
    totalAmount: 0,
    tipAmount: 0,
}

const elements = {
    billInput: document.querySelector('#bill'),
    peopleInput: document.querySelector('#people'),
    errorMessage: document.querySelector('#people-error'),
    tipBtn: document.querySelectorAll('.tip-btn'),
    customInput: document.querySelector('#custom-tip-input'),
    resetBtn: document.querySelector('.reset-btn'),
    tipAmountDisplay: document.querySelector('#tip-amount'),
    totalAmountDisplay: document.querySelector('#total-amount')
}


/*===== VALIDATOIN =====*/
function validatePeople() {
    const value = elements.peopleInput.value;
    const isValid = value === '' || parseInt(value) > 0;

    if (!isValid) {
        elements.errorMessage.classList.add('error-message');
        elements.errorMessage.hidden = false;
        elements.peopleInput.classList.add('input-error');
        elements.peopleInput.setAttribute('aria-invalid', 'true');
        state.people = 0;
    } else {
        elements.errorMessage.classList.remove('error-message');
        elements.errorMessage.hidden = true;
        elements.peopleInput.classList.remove('input-error');
        elements.peopleInput.setAttribute('aria-invalid', 'false');
        state.people = value === '' ? 0 : parseFloat(value);
    }
    let timeId;
    clearTimeout(timeId);
    timeId = setTimeout(() => {
        calculateTip();
        updateDisplay();
    }, 250);
    return isValid;
}


/*===== TIP SELECTION =====*/
function handleTipButtonClick(clickedButton) {
    if (state.activeTipBtn) {
        state.activeTipBtn.classList.remove('active');
        state.activeTipBtn.setAttribute('aria-pressed', 'false');
    }

    if (state.activeTipBtn === clickedButton) {
        state.activeTipBtn = null;
        state.tipPercent = 0;
    } else {
        clickedButton.classList.add('active');
        clickedButton.setAttribute('aria-pressed', 'true');
        state.activeTipBtn = clickedButton;
        state.tipPercent = parseInt(clickedButton.dataset.tip)
        elements.customInput.value = '';
    }

    updateResetButton();
}

function handleCustomTipInput() {
    if (state.activeTipBtn) {
        state.activeTipBtn.classList.remove('active');
        state.activeTipBtn.setAttribute('aria-pressed', 'false');
        state.activeTipBtn = null;
    }

    state.tipPercent = parseFloat(elements.customInput.value) || 0;
    updateResetButton();
    let timeId;
    clearTimeout(timeId);
    timeId = setTimeout(() => {
        calculateTip();
        updateDisplay();
    }, 250);
}


/*===== RESET BUTTON =====*/
function updateResetButton() {
    const hasData = 
        elements.billInput.value.trim() !== '' ||
        elements.peopleInput.value.trim() !== '' ||
        state.tipPercent > 0 ||
        elements.customInput.value.trim() !== '';

    elements.resetBtn.disabled = !hasData;
    elements.resetBtn.setAttribute('aria-disabled', !hasData);
}

function handleReset() {
    elements.billInput.value = '';
    elements.peopleInput.value = '';
    elements.customInput.value = '';

    if(state.activeTipBtn) {
        state.activeTipBtn.classList.remove('active');
        state.activeTipBtn.setAttribute('aria-pressed', 'false');
    }

    state.bill = '';
    state.people = '';
    state.tipPercent = 0;
    state.activeTipBtn = null;

    elements.errorMessage.classList.remove('error-message');
    elements.errorMessage.hidden = true;
    elements.peopleInput.classList.remove('input-error');
    elements.peopleInput.setAttribute('aria-invalid', 'false');

    updateResetButton();
    let timeId;
    clearTimeout(timeId);
    timeId = setTimeout(() => {
        calculateTip();
        updateDisplay();
    }, 250);
}

/*===== CALCULATE TIP =====*/
function calculateTip() {
    const bill = parseFloat(state.bill) || 0;
    const people = parseFloat(state.people) || 1; // минимум 1 человек
    const tipPercent = parseFloat(state.tipPercent) || 0;
    
    if (bill <= 0 || people <= 0 || tipPercent < 0) {
        state.tipAmount = 0;
        state.totalAmount = 0;
        return;
    }
    
    const decimalTipPercent = tipPercent / 100;
    const tipsTotal = bill * decimalTipPercent;
    const tipsPerPerson = tipsTotal / people;
    const totalPerPerson = (bill + tipsTotal) / people;

    state.tipAmount = parseFloat(tipsPerPerson);
    state.totalAmount = parseFloat(totalPerPerson);
}

function updateDisplay() {
    elements.tipAmountDisplay.textContent = `$${state.tipAmount.toFixed(2)}`;
    elements.totalAmountDisplay.textContent = `$${state.totalAmount.toFixed(2)}`;
}


/*===== EVENT LISTENERS =====*/
function initEventListener() {
    elements.peopleInput.addEventListener('input', () => {
        validatePeople();
        updateResetButton();
    });

    elements.tipBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            handleTipButtonClick(btn)
            let timeId;
            clearTimeout(timeId);
            timeId = setTimeout(() => {
                calculateTip();
                updateDisplay();
            }, 250);
        });
    });

    elements.customInput.addEventListener('input', handleCustomTipInput);

    elements.billInput.addEventListener('input', function() {
        state.bill = parseFloat(this.value) || 0;
        let timeId;
        clearTimeout(timeId);
        timeId = setTimeout(() => {
            calculateTip();
            updateDisplay();
        }, 250);
        updateResetButton();
    });

    elements.resetBtn.addEventListener('click', handleReset);
}


/*===== INIT =====*/
function init() {
    initEventListener();
    updateResetButton();
}

document.addEventListener('DOMContentLoaded', init);