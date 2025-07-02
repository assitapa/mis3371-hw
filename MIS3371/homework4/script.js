/*
Program name: script.js
Author: Abhi Sitapara
Date created: 06/08/2025
Date last edited: 06/30/2025
Version: 3.0
Description: Refactored and enhanced JavaScript with real-time validation for patient registration form 
*/

// Configuration for all fields to be validated. Each key corresponds to an input's ID.

const validationConfig = {
    fname: {
        errorElement: 'fname-error',
        required: true,
        pattern: /^[a-zA-Z'-]+$/,
        maxLength: 30,
        messages: {
            required: 'First name is required.',
            pattern: 'First name can only contain letters, apostrophes, and dashes.',
            maxLength: 'First name must be 30 characters or less.'
        }
    },
    lname: {
        errorElement: 'fname-error',
        required: true,
        pattern: /^[a-zA-Z'-]+$/,
        maxLength: 30,
        messages: {
            required: 'Last name is required.',
            pattern: 'Last name can only contain letters, apostrophes, and dashes.',
            maxLength: 'Last name must be 30 characters or less.'
        }
    },
    minitial: {
        pattern: /^[a-zA-Z]$/,
    },
    dob: {
        errorElement: 'dob-error',
        required: true,
        // Custom validation for date of birth to check against future dates and age limit
        custom: value => {
            const dobDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 120);
            if (dobDate > today) return 'Date of birth cannot be in the future.';
            if (dobDate < minDate) return 'Date of birth cannot be more than 120 years ago.';
            return '';
        },
        messages: {
            required: 'Date of birth is required.'
        }
    },
    ssn: {
        errorElement: 'ssn-error',
        required: true,
        pattern: /^\d{3}-\d{2}-\d{4}$/,
        // Formatter to automatically add dashes to SSN
        formatter: value => {
            const digits = value.replace(/\D/g, ''); // Remove non-digits
            if (digits.length > 5) return `${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 9)}`;
            if (digits.length > 3) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
            return digits;
        },
        messages: {
            required: 'Social Security Number is required.',
            pattern: 'SSN must be in XXX-XX-XXXX format.'
        }
    },
    address1: {
        errorElement: 'address1-error',
        required: true,
        minLength: 2,
        maxLength: 30,
        messages: {
            required: 'Address Line 1 is required.',
            minLength: 'Address must be between 2 and 30 characters.',
            maxLength: 'Address must be between 2 and 30 characters.'
        }
    },
    address2: {
        errorElement: 'address2-error',
        minLength: 2,
        maxLength: 30,
        messages: {
            minLength: 'Address Line 2 must be between 2 and 30 characters if provided.',
            maxLength: 'Address Line 2 must be between 2 and 30 characters if provided.'
        }
    },
    city: {
        errorElement: 'address-error',
        required: true,
        minLength: 2,
        maxLength: 30,
        messages: {
            required: 'City is required.',
            minLength: 'City must be between 2 and 30 characters.',
            maxLength: 'City must be between 2 and 30 characters.'
        }
    },
    state: {
        errorElement: 'address-error',
        required: true,
        messages: {
            required: 'State is required.'
        }
    },
    zip: {
        errorElement: 'address-error',
        required: true,
        pattern: /^\d{5}(-\d{4})?$/,
        messages: {
            required: 'Zip code is required.',
            pattern: 'Zip code must be in 12345 or 12345-6789 format.'
        }
    },
    email: {
        errorElement: 'email-error',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        lowercase: true,
        messages: {
            required: 'Email address is required.',
            pattern: 'Please enter a valid email address (name@domain.tld).'
        }
    },
    phone: {
        errorElement: 'phone-error',
        required: true,
        pattern: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
        // Formatter to automatically add dashes to phone number
        formatter: value => {
            const digits = value.replace(/\D/g, ''); // Remove non-digits
            if (digits.length > 6) return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
            if (digits.length > 3) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
            return digits;
        },
        messages: {
            required: 'Phone number is required.',
            pattern: 'Phone must be in XXX-XXX-XXXX format.'
        }
    },
    symptoms: {
        errorElement: 'symptoms-error',
        // Custom validation to prevent double quotes
        custom: value => (value.includes('"') ? 'Double quotes are not allowed in symptoms description.' : ''),
    },
    userid: {
        errorElement: 'userid-error',
        required: true,
        minLength: 5,
        maxLength: 30,
        pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
        lowercase: true,
        // Custom validation to ensure user ID starts with a letter
        custom: value => (!/^[a-zA-Z]/.test(value) ? 'User ID must start with a letter.' : ''),
        messages: {
            required: 'User ID is required.',
            minLength: 'User ID must be between 5 and 30 characters.',
            maxLength: 'User ID must be between 5 and 30 characters.',
            pattern: 'User ID can only contain letters, numbers, underscores, and dashes.'
        }
    },
    pass1: {
        errorElement: 'pass1-error',
        required: true,
        minLength: 8,
        maxLength: 30,
        // Custom validation for password complexity and checking against user ID
        custom: value => {
            const userid = document.getElementById('userid').value.toLowerCase();
            if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
            if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
            if (!/[0-9]/.test(value)) return 'Password must contain at least one number.';
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value)) return 'Password must contain at least one special character.';
            if (value.toLowerCase() === userid) return 'Password cannot be the same as your User ID.';
            return '';
        },
        messages: {
            required: 'Password is required.',
            minLength: 'Password must be between 8 and 30 characters.',
            maxLength: 'Password must be between 8 and 30 characters.'
        }
    },
    pass2: {
        errorElement: 'pass2-error',
        required: true,
        // Custom validation to confirm password matches pass1
        custom: value => (value !== document.getElementById('pass1').value ? 'Passwords do not match.' : ''),
        messages: {
            required: 'Password confirmation is required.'
        }
    }
};

// Global object to track the validity state of each form field.
const validationState = {};

// Event listener for when the DOM content is fully loaded.
// Initializes the form by hiding the review section, setting date constraints,
// updating health slider, setting up field validation listeners, and updating submit button state.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('review-section').style.display = 'none';
    setupDateConstraints();
    updateHealthValue(document.getElementById('health_scale').value);
    initializeValidation();
    updateSubmitButtonState();
});

//Sets the minimum and maximum date constraints for the Date of Birth input field.
function setupDateConstraints() {
    const dobInput = document.getElementById('dob');
    const today = new Date();
    dobInput.max = today.toISOString().split('T')[0]; // Max date is today
    today.setFullYear(today.getFullYear() - 120);
    dobInput.min = today.toISOString().split('T')[0]; // Min date is 120 years ago
}

//Initializes validation for all form fields based on the validationConfig.
function initializeValidation() {
    // Iterate over each field defined in validationConfig
    Object.keys(validationConfig).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            // Set initial validation state; optional fields are true, required are false
            validationState[id] = !validationConfig[id].required;
            // Determine event type based on input tag (change for select/textarea, input for others)
            const event = ['SELECT', 'TEXTAREA'].includes(input.tagName) ? 'change' : 'input';
            input.addEventListener(event, () => handleValidation(input));
            input.addEventListener('blur', () => handleValidation(input));
        }
    });

    // Set up validation for radio button groups (gender, vaccinated, insurance)
    ['gender', 'vaccinated', 'insurance'].forEach(name => {
        validationState[name] = false; // Initialize radio group state to invalid
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.addEventListener('change', validateRadioButtons);
        });
    });
    validateRadioButtons(false); // Initial check for radios without displaying errors
}

//Handles the validation logic for a
function handleValidation(input) {
    const config = validationConfig[input.id];
    let value = input.value;
    
    // Apply lowercase and formatter if specified in config
    if (config.lowercase) value = value.toLowerCase();
    if (config.formatter) value = config.formatter(value);
    input.value = value; // Update input value with formatted text
    
    let error = '';
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    // Apply validation rules in order of precedence
    if (config.required && !trimmedValue) error = config.messages.required;
    else if (trimmedValue) {
        if (config.minLength && trimmedValue.length < config.minLength) error = config.messages.minLength;
        else if (config.maxLength && trimmedValue.length > config.maxLength) error = config.messages.maxLength;
        else if (config.pattern && !config.pattern.test(trimmedValue)) error = config.messages.pattern;
        else if (config.custom) error = config.custom(trimmedValue); // Custom validation
    }
    
    // Update the global validation state for the current input
    validationState[input.id] = !error;
    
    // Display error message in the correct error div (shared error elements handled)
    if (config.errorElement) {
        const errorDiv = document.getElementById(config.errorElement);
        // Find if any other field sharing this error element has an error
        const sharedFields = Object.keys(validationConfig).filter(key => validationConfig[key].errorElement === config.errorElement);
        const firstError = sharedFields.map(id => getFieldError(id)).find(e => e);
        showError(errorDiv, firstError || '');
    }

    // Add/remove valid/invalid classes for visual feedback
    input.classList.toggle('invalid', !!error);
    input.classList.toggle('valid', !error && !!trimmedValue);
    
    // Special case: re-validate password confirmation when pass1 changes
    if (input.id === 'pass1') handleValidation(document.getElementById('pass2'));

    updateSubmitButtonState(); // Update submit button status after each validation
}

//Retrieves the specific error message for a given field ID, used for shared error elements.
function getFieldError(id) {
    const input = document.getElementById(id);
    const config = validationConfig[id];
    let value = input.value.trim();
    if (config.required && !value) return config.messages.required;
    if (value) {
        if (config.minLength && value.length < config.minLength) return config.messages.minLength;
        if (config.maxLength && value.length > config.maxLength) return config.messages.maxLength;
        if (config.pattern && !config.pattern.test(value)) return config.messages.pattern;
        if (config.custom) return config.custom(value);
    }
    return '';
}

//Validates radio button groups (gender, vaccinated, insurance).
//Updates the global validation state for these groups and displays combined error messages.
function validateRadioButtons(show = true) {
    const radioErrorDiv = document.getElementById('radio-error');
    let errors = [];

    // Check each radio group for selection
    ['gender', 'vaccinated', 'insurance'].forEach(name => {
        const isChecked = document.querySelector(`input[name="${name}"]:checked`);
        validationState[name] = !!isChecked; // Update state based on selection
        if (!isChecked) {
            // Construct appropriate error message for each radio group
            const label = name.charAt(0).toUpperCase() + name.slice(1);
            const message = label === 'Vaccinated' ? 'COVID-19 vaccination status is required.' : `${label} selection is required.`;
            errors.push(message);
        }
    });

    // Display combined error messages if 'show' is true
    if (show) {
        showError(radioErrorDiv, errors.join(' '));
    }
    updateSubmitButtonState(); // Update submit button status
}

//Displays an error message in the specified error division.
function showError(errorDiv, message) {
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

//Updates the displayed value of the health scale slider.
function updateHealthValue(val) {
    document.getElementById('health-value').textContent = val;
}

//Updates the state of the submit and validate buttons based on overall form validity.
//Enables the submit button and changes validate button text/color if all fields are valid.
function updateSubmitButtonState() {
    // Check if all fields in the validationState are true (valid)
    const allValid = Object.values(validationState).every(Boolean);
    const submitButton = document.getElementById('submit-button');
    const validateButton = document.getElementById('validate-button');
    
    // Toggle submit button visibility
    submitButton.style.display = allValid ? 'inline-block' : 'none';
    // Update validate button text and color
    validateButton.textContent = allValid ? 'ALL FIELDS VALID ✓' : 'VALIDATE';
    validateButton.style.backgroundColor = allValid ? '#28a745' : '#007bff';
}

//Triggers validation for all fields and, if all are valid, shows the review section.
//Otherwise, scrolls to the first invalid field.
function validateAllFields() {
    // Manually trigger validation for all configured input fields
    Object.keys(validationConfig).forEach(id => handleValidation(document.getElementById(id)));
    // Manually trigger validation for radio button groups, ensuring errors are shown
    validateRadioButtons(true);
    
    // If all fields are now valid, display the review section
    if (Object.values(validationState).every(Boolean)) {
        showReviewSection();
    } else {
        // Otherwise, find and scroll to the first displayed error message
        const firstError = document.querySelector('.error-message:not(:empty)');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

//Collects all form data and populates the review section.
//Formats data for display and then makes the review section visible.
function showReviewSection() {
    const reviewOutput = document.getElementById('review-output');
    reviewOutput.innerHTML = ''; // Clear previous review content
    
    // Collect data from all relevant form fields
    const data = {
        'Full Name': `${document.getElementById('fname').value} ${document.getElementById('minitial').value} ${document.getElementById('lname').value}`.trim().replace(/\s+/g, ' '),
        'Date of Birth': document.getElementById('dob').value,
        'SSN': document.getElementById('ssn').value.replace(/\d(?!\d{0,3}$)/g, '*'), // Mask most of SSN for review
        'Address': `${document.getElementById('address1').value}<br>${document.getElementById('address2').value ? document.getElementById('address2').value + '<br>' : ''}${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zip').value}`,
        'Email': document.getElementById('email').value,
        'Phone': document.getElementById('phone').value,
        'Gender': document.querySelector('input[name="gender"]:checked')?.value,
        'COVID-19 Vaccinated': document.querySelector('input[name="vaccinated"]:checked')?.value,
        'Has Insurance': document.querySelector('input[name="insurance"]:checked')?.value,
        'Current Health (1-10)': document.getElementById('health_scale').value,
        'Medical Conditions': Array.from(document.querySelectorAll('input[name="cond"]:checked')).map(el => el.labels[0].textContent).join(', ') || 'None',
        'Current Symptoms': document.getElementById('symptoms').value || 'None',
        'User ID': document.getElementById('userid').value
    };
    
    // Add each collected data point as a row in the review section
    Object.entries(data).forEach(([label, value]) => {
        const formattedValue = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
        addReviewRow(label, formattedValue || 'N/A');
    });
    
    // Make review section visible and scroll it into view
    document.getElementById('review-section').style.display = 'block';
    document.getElementById('review-section').scrollIntoView({ behavior: 'smooth' });
}


//Adds a single row (label and value) to the review output section.
 
function addReviewRow(label, value) {
    const reviewOutput = document.getElementById('review-output');
    reviewOutput.innerHTML += `<div class="review-label">${label}:</div><div class="review-value">${value}</div>`;
}

//Hides the review section and scrolls back to the main form.
function hideReviewSection() {
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('main-form').scrollIntoView({ behavior: 'smooth' });
}

//Submits the patient registration form.
function submitForm() {
    document.getElementById('patient-form').submit();
}


//Clears the form, resets validation states, removes visual feedback, and hides the review section.
function clearForm() {
    document.getElementById('patient-form').reset(); // Reset form inputs
    // Clear validation classes and error messages for all fields
    Object.keys(validationConfig).forEach(id => {
        const input = document.getElementById(id);
        input.classList.remove('valid', 'invalid');
        const config = validationConfig[id];
        if (config.errorElement) document.getElementById(config.errorElement).textContent = '';
    });
    document.querySelectorAll('.error-message').forEach(div => div.textContent = ''); // Clear all error divs
    initializeValidation(); // Re-initialize validation state
    updateSubmitButtonState(); // Update submit button state
    hideReviewSection(); // Hide review section
    updateHealthValue(5); // Reset health slider to default
} 