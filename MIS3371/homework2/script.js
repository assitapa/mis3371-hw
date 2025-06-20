/*
Program name: script.js
Author: Abhi Sitapara
Date created: 06/08/2025
Date last edited: 06/20/2025
Version: 1.0
Description: JavaScript for Horizon Health Solutions patient registration form */
document.addEventListener('DOMContentLoaded', function() {
    // Hide review section and disable submit button
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('submit-button').disabled = true;

    // Set max and min dates for DOB
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        today.setFullYear(today.getFullYear() - 120);
        const minDate = today.toISOString().split('T')[0];
        dobInput.setAttribute('max', maxDate);
        dobInput.setAttribute('min', minDate);
    }

    // Update health value
    updateHealthValue(document.getElementById('health_scale').value);
});

// Update health value
function updateHealthValue(val) {
    document.getElementById('health-value').textContent = val;
}

// Review and validate form
function reviewAndValidate() {
    let isFormValid = true;
    const reviewOutput = document.getElementById('review-output');
    reviewOutput.innerHTML = ''; 

    function addReviewRow(label, value, status, message = '') {
        const statusClass = status ? 'status-pass' : 'status-fail';
        const statusText = status ? 'PASS' : `FAIL: ${message}`;
        if (!status) isFormValid = false;

        reviewOutput.innerHTML += `
            <div class="review-label">${label}:</div>
            <div class="review-value">${value}</div>
            <div class="review-status ${statusClass}">${statusText}</div>
        `;
    }

    // --- Field Validation ---
    const fname = document.getElementById('fname').value;
    const minitial = document.getElementById('minitial').value;
    const lname = document.getElementById('lname').value;
    const dob = document.getElementById('dob').value;
    const ssn = document.getElementById('ssn').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const symptoms = document.getElementById('symptoms').value;
    const health_scale = document.getElementById('health_scale').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const insurance = document.querySelector('input[name="insurance"]:checked')?.value;
    const vaccinated = document.querySelector('input[name="vaccinated"]:checked')?.value || 'No';
    const userid = document.getElementById('userid').value;
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;

    // Full Name
    const fullName = `${fname} ${minitial} ${lname}`.trim();
    const isFnameValid = /^[a-zA-Z'-]+$/.test(fname);
    const isLnameValid = /^[a-zA-Z'-]+$/.test(lname);
    addReviewRow('Full Name', `${fullName ? fullName : 'Not provided'}`, isFnameValid && isLnameValid, 'First and Last name are required and should contain only letters, apostrophes, or dashes.');

    // DOB
    const dobDate = new Date(dob);
    const today = new Date();
    today.setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 120);
    maxDate.setHours(0,0,0,0);
    const isDobValid = dob && dobDate <= today && dobDate >= maxDate;
    addReviewRow('Date of Birth', `${dob ? dob : 'Not provided'}`, isDobValid, 'Must be a valid date, not in the future, and not more than 120 years ago.');

    // SSN
    const isSsnValid = /^\d{3}-\d{2}-\d{4}$/.test(ssn);
    addReviewRow('SSN', `${ssn ? ssn.replace(/\d/g, '*') : 'Not provided'}`, isSsnValid, 'Must be in XXX-XX-XXXX format.');

    // Address
    const fullAddress = `${address1}<br>${address2 ? address2 + '<br>' : ''}${city}${!state ? '' : ','} ${state} ${zip.substring(0, 5)}`;
    const isAddressValid = address1 && city && state && /^\d{5}(-\d{4})?$/.test(zip);
    addReviewRow('Address', fullAddress, isAddressValid, 'Address Line 1, City, State, and Zip are required in correct format (hover over fields for more info).');
    
    // Contact
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    addReviewRow('Email', `${email ? email : 'Not provided'}`, isEmailValid, 'Must be a valid email format.');
    
    const isPhoneValid = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone);
    addReviewRow('Phone', `${phone ? phone : 'Not provided'}`, isPhoneValid, 'Must be in XXX-XXX-XXXX format.');

    // User ID
    const isUseridValid = /^[a-zA-Z][a-zA-Z0-9_-]{4,29}$/.test(userid);
    addReviewRow('User ID', `${userid ? userid : 'Not provided'}`, isUseridValid, 'Must be 5-30 chars, start with a letter, no special characters other than - or _.');

    // Password
    const isPassLengthValid = pass1.length >= 8 && pass1.length <= 30;
    const hasUpper = /[A-Z]/.test(pass1);
    const hasLower = /[a-z]/.test(pass1);
    const hasNumber = /[0-9]/.test(pass1);
    const hasSpecial = /[!@#$%^&*()-_+=\[\]{}|\\;:'<>,.?/`~]/.test(pass1);
    const isPassComplex = hasUpper && hasLower && hasNumber && hasSpecial;
    const doPasswordsMatch = pass1 === pass2;
    const isPasswordValid = isPassLengthValid && isPassComplex && doPasswordsMatch;
    let passMessage = '';
    if (!isPassLengthValid) passMessage = 'Password must be 8-30 characters long.';
    else if (!isPassComplex) passMessage = 'Password needs uppercase, lowercase, number, and special character.';
    else if (!doPasswordsMatch) passMessage = 'Passwords do not match.';
    addReviewRow('Password', `${pass1 ? '*'.repeat(pass1.length) : 'Not provided'}`, isPasswordValid, passMessage);

    // Medical Conditions
    const conditions = Array.from(document.querySelectorAll('input[name="cond"]:checked')).map(el => el.labels[0].textContent).join(', ') || 'None';
    addReviewRow('Medical Conditions', conditions, true);

    // Gender
    const isGenderValid = gender === 'male' || gender === 'female' || gender === 'other';
    addReviewRow('Gender', `${gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not provided'}`, isGenderValid, 'Must be Male, Female, or Other.');

    // Vaccinated
    const isVaccinatedValid = vaccinated === 'yes' || vaccinated === 'no';
    addReviewRow('COVID-19 Vaccinated', `${vaccinated ? vaccinated.charAt(0).toUpperCase() + vaccinated.slice(1) : 'Not provided'}`, isVaccinatedValid, 'Must be yes or no.');

    // Insurance
    const isInsuranceValid = insurance === 'yes' || insurance === 'no';
    addReviewRow('Has Insurance', `${insurance ? insurance.charAt(0).toUpperCase() + insurance.slice(1) : 'Not provided'}`, isInsuranceValid, 'Must be yes or no.');

    // Current Health
    addReviewRow('Current Health (1-10)', health_scale, true);

    // Symptoms
    addReviewRow('Symptoms', symptoms || 'None', true);

    // --- Finalize ---
    document.getElementById('review-section').style.display = 'block';
    document.getElementById('review-section').scrollIntoView({ behavior: 'smooth' });

    // Submit button
    const submitButton = document.getElementById('submit-button');
    const finalSubmitButton = document.getElementById('final-submit-button');

    // Disable submit button if form is not valid
    submitButton.disabled = !isFormValid;
    finalSubmitButton.disabled = !isFormValid;

    // Submit button functionality
    finalSubmitButton.onclick = () => {
        if(isFormValid) {
            document.querySelector('form').submit();
        }
    };

    // Re-attach the clear button functionality
    document.querySelector('button[type="reset"]').onclick = () => {
        document.getElementById('main-form').style.display = 'block';
        document.getElementById('review-section').style.display = 'none';
        submitButton.disabled = true;
    };
}

