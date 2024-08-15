document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const eventForm = document.getElementById('event-form');
    const eventSearchform = document.getElementById('eventSearch-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];
            const firstName = document.getElementById('firstNameInput').value.trim();
            const lastName = document.getElementById('lastNameInput').value.trim();
            const email = document.getElementById('emailAddressInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();
            const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();
            const role = document.getElementById('roleInput').value.trim();


            // Validate First Name
            if (!firstName || !/^[A-Za-z]{2,25}$/.test(firstName)) {
                errors.push('First Name must be 2-25 characters long and contain only letters.');
            }

            // Validate Last Name
            if (!lastName || !/^[A-Za-z]{2,25}$/.test(lastName)) {
                errors.push('Last Name must be 2-25 characters long and contain only letters.');
            }

            // Validate Email Address
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Invalid email address.');
            }

            // Validate Password
            if (!password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]{8,}$/.test(password)) {
                errors.push('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.');
            }

            // Validate Confirm Password
            if (password !== confirmPassword) {
                errors.push('Passwords do not match.');
            }

            // Validate Role
            if (!role || (role !== 'admin' && role !== 'user')) {
                errors.push('Role must be either admin or user.');
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                registerForm.submit();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const email = document.getElementById('emailAddressInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();

            // Validate Email Address
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('Invalid email address.');
            }

            // Validate Password
            if (!password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]{8,}$/.test(password)) {
                errors.push('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.');
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                loginForm.submit();
            }
        });
    }

// Event Creation form
    if (eventForm) {
        eventForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            const eventName = document.getElementById('eventNameInput').value.trim();
            const eventDate = document.getElementById('eventDateInput').value.trim();
            const location = document.getElementById('locationInput').value.trim();
            const category = document.getElementById('categoryInput').value.trim();
            const description = document.getElementById('descriptionInput').value.trim();
            const nearByPort = document.getElementById('nearByPortInput').value.trim();
            const eventMode = document.getElementById('eventModeInput').value.trim();
            const registrationFee = document.getElementById('registrationFeeInput').value.trim();
            const contactPerson = document.getElementById('contactPersonInput').value.trim();


            // Validate Event Name
            if (!eventName || eventName.trim().length === 0) {
                errors.push('Event Name must not be empty');
            }
            // Event Date validation (check if the date is not in the past)
            const currentDate = new Date().toISOString().split('T')[0];
            if (eventDate === '' || eventDate <= currentDate) {
                isValid = false;
                errorMessage += 'Please enter a valid future date for the event.\n';
            }

           // Validate Event Location
           if (!location || location.trim().length === 0) {
            errors.push('Event Location must not be empty');
             }

           // Validate Event Category
           if (!category || category.trim().length === 0) {
            errors.push('Event Category must not be empty');
             }

           // Validate Event Description
           if (!description || description.trim().length === 0) {
            errors.push('Event Description must not be empty');
             }

           // Validate Event Near By Port
           if (!nearByPort || nearByPort.trim().length === 0) {
            errors.push('Event Near By Port must not be empty');
             }

             // Validate Event Mode
           if (!eventMode || eventMode.trim().length === 0) {
            errors.push('Event Mode must not be empty');
             }

           // Validate Event Registration Fee
           if (!registrationFee || registrationFee.trim().length === 0) {
            errors.push('Event Registration Fee must not be empty');
             }

  
            if (typeof registrationFee !== 'number') {
                errors.push('Event Registration Fee must be Number');
            }
        
            if (registrationFee <= 0 || !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
                errors.push('Event Registration Fee must be a number greater than 0 with up to 2 decimal places.');
            }
            
           // Validate Event Contact Person
           if (!contactPerson || contactPerson.trim().length === 0) {
            errors.push('Event Contact Person must not be empty');
             }

            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                //registerForm.submit();
 
                // AJAX logic for form submission
                
                fetch('/event/create', {
                    method: 'POST',
                    body: eventForm,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                    alert('Event created successfully!');
                    window.location.href = '/event';
                    } else {
                    alert('Error creating event');
                    }
                })
                .catch(error => console.error('Error:', error));

            }
        });
    }

    //Event Search
    if (eventSearchform) {
        eventSearchform.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];

            // Get form values
            const eventName = document.getElementById('eventNameInput').value.trim();
            const category = document.getElementById('categoryInput').value.trim();
            const date = document.getElementById('dateInput').value;
            const registrationFee = document.getElementById('registrationFeeInput').value;


            // Event Name validation (Optional, so no strict validation)
            if (eventName.length > 100) {
                errors.push('Event Name is too long.');
            }

            // Category validation (Optional, so no strict validation)
            if (category.length > 100) {
                errors.push('Category is too long.');
            }

            // Date validation (Optional field)
            const currentDate = new Date().toISOString().split('T')[0];
            if (date !== '' && date < currentDate) {
                errors.push('Please enter a valid future date for the event.');
            }            



            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                //registerForm.submit();
 
                // AJAX logic for form submission
                
                fetch('/event/search', {
                    method: 'POST',
                    body: eventSearchform,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Handle successful search results
                        const results = JSON.parse(response);
                        displaySearchResults(response);

                    } else {
                        alert('Error in searching event');
                    }
                })
                .catch(error => console.error('Error:', error));

            }
        });
    }



});


function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('eventList');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsDiv.innerHTML = '<p>No events found matching your criteria.</p>';
    } else {
        results.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-result';
            eventDiv.innerHTML = `
                <h3>${event.eventName}</h3>
                <p>Category: ${event.category}</p>
                <p>Date: ${event.date}</p>
                <p>Registration Fee: ${event.registrationFee}</p>
            `;
            searchResultsDiv.appendChild(eventDiv);
        });
    }
}
