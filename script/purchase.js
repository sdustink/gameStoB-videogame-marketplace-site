const form = document.querySelector('form');

function showError(input, message) {
    clearError(input);
    input.style.borderColor = '#e63946';

    const error = document.createElement('span');
    error.className = 'input-error-msg';
    error.textContent = message;
    error.style.cssText = 'color:#e63946; font-size:13px; font-weight:normal; display:block; margin-top:-14px; margin-bottom:12px;';
    input.insertAdjacentElement('afterend', error);
}

function clearError(input) {
    input.style.borderColor = '';
    const next = input.nextElementSibling;
    if (next && next.classList.contains('input-error-msg')) next.remove();
}

function showRadioError(container, message) {
    clearRadioError(container);
    const existing = container.parentElement.querySelector('.input-error-msg');
    if (existing) existing.remove();

    const error = document.createElement('span');
    error.className = 'input-error-msg';
    error.textContent = message;
    error.style.cssText = 'color:#e63946; font-size:13px; font-weight:normal; display:block; margin-top:-10px; margin-bottom:12px;';
    container.insertAdjacentElement('afterend', error);
}

function clearRadioError(container) {
    const next = container.nextElementSibling;
    if (next && next.classList.contains('input-error-msg')) next.remove();
}

// validation
function validateFullName(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'Full name is required.'), false;
    if (val.length < 3) return showError(input, 'Name must be at least 3 characters.'), false;
    if (!/^[a-zA-Z\s.'-]+$/.test(val)) return showError(input, 'Name contains invalid characters.'), false;
    clearError(input);
    return true;
}

function validateEmail(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'Email is required.'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return showError(input, 'Enter a valid email address.'), false;
    clearError(input);
    return true;
}

function validatePhone(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'Phone number is required.'), false;
    if (!val.startsWith('08')) return showError(input, 'Phone number must start with "08".'), false;
    
    const digits = val.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 13) return showError(input, 'Enter a valid phone number (9–13 digits).'), false;
    clearError(input);
    return true;
}

function validateCardProvider(container) {
    const selected = container.querySelector('input[type="radio"]:checked');
    if (!selected) return showRadioError(container, 'Please select a card provider.'), false;
    clearRadioError(container);
    return true;
}

function validateCardName(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'Cardholder name is required.'), false;
    if (!/^[a-zA-Z\s.'-]+$/.test(val)) return showError(input, 'Name contains invalid characters.'), false;
    clearError(input);
    return true;
}

function validateCardNumber(input) {
    const val = input.value.replace(/\D/g, '');
    if (!val) return showError(input, 'Card number is required.'), false;
    if (val.length !== 16) return showError(input, 'Card number must be 16 digits.'), false;
    clearError(input);
    return true;
}

function validateExpiry(monthSelect, yearInput) {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value.trim());
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    clearError(yearInput);

    if (!yearInput.value.trim()) return showError(yearInput, 'Expiration year is required.'), false;
    if (isNaN(year) || year < currentYear || year > currentYear + 20)
        return showError(yearInput, `Enter a valid year (${currentYear}–${currentYear + 20}).`), false;
    if (year === currentYear && month < currentMonth)
        return showError(yearInput, 'This card has already expired.'), false;

    clearError(yearInput);
    return true;
}

function validateCVV(input) {
    const val = input.value.trim();
    if (!val) return showError(input, 'CVV is required.'), false;
    if (!/^\d{3,4}$/.test(val)) return showError(input, 'CVV must be 3 or 4 digits.'), false;
    clearError(input);
    return true;
}

// auto format
const cardNumberInput = document.getElementById('ccnum');
cardNumberInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = val.match(/.{1,4}/g)?.join('-') || val;
});

const phoneInput = document.getElementById('num');
phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 13);
    if (val.length > 8) val = val.slice(0, 4) + '-' + val.slice(4, 8) + '-' + val.slice(8);
    else if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4);
    e.target.value = val;
});

// Clear error
['fname','email','num','cname','ccnum','expyear','cvv'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => clearError(e.target));
});

// submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cardProvider = document.querySelector('.card-provider');

    const isValid = [
        validateFullName(document.getElementById('fname')),
        validateEmail(document.getElementById('email')),
        validatePhone(document.getElementById('num')),
        validateCardProvider(cardProvider),
        validateCardName(document.getElementById('cname')),
        validateCardNumber(document.getElementById('ccnum')),
        validateExpiry(document.getElementById('expmonth'), document.getElementById('expyear')),
        validateCVV(document.getElementById('cvv')),
    ].every(Boolean);

    if (isValid) {
        console.log('Form validated');
        window.location.href = 'success.html';
    } else {
        const firstError = form.querySelector('.input-error-msg');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});