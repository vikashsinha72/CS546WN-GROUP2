document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const eventForm = document.getElementById('eventCreation-form');
    const eventEditForm = document.getElementById('eventEdit-form');
    const eventSearchform = document.getElementById('eventSearch-form');
    

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];
            const username = document.getElementById('usernameInput').value.trim();
            const firstName = document.getElementById('firstNameInput').value.trim();
            const lastName = document.getElementById('lastNameInput').value.trim();
            const email = document.getElementById('emailAddressInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();
            const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();
            // const role = document.getElementById('roleInput').value.trim();

            if (!username || !/^[A-Za-z0-9]{4,15}$/.test(firstName)) {
                errors.push('Username must be 4-15 characters long and have no special characters.');
            }

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

            // // Validate Role
            // if (!role || (role !== 'admin' && role !== 'user')) {
            //     errors.push('Role must be either admin or user.');
            // }

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

            const username = document.getElementById('usernameInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();

            // // Validate username
            if (!username || !/^[A-Za-z0-9]{4,15}$/.test(username)) {
                errors.push('Username must be 4-15 characters long and have no special characters.');
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

// // Event Creation form
//     if (eventForm) {
//         eventForm.addEventListener('submit', (event) => {
//             event.preventDefault();
//             const errors = [];

//             const eventName = document.getElementById('eventNameInput').value.trim();
//             const eventDate = document.getElementById('dateInput').value.trim();
//             const location = document.getElementById('locationInput').value.trim();
//             const category = document.getElementById('categoryInput').value.trim();
//             const description = document.getElementById('descriptionInput').value.trim();
//             const nearByPort = document.getElementById('portInput').value.trim();
//             const eventMode = document.getElementById('modeInput').value.trim();
//             const registrationFee = document.getElementById('feeInput').value.trim();

//             // Validate Event Name
//             if (!eventName || eventName.trim().length === 0) {
//                 errors.push('Event Name must not be empty');
//             }
//             // Event Date validation (check if the date is not in the past)
//             const currentDate = new Date().toISOString().split('T')[0];
//             if (eventDate === '' || eventDate <= currentDate) {
//                 isValid = false;
//                 errorMessage += 'Please enter a valid future date for the event.\n';
//             }

//            // Validate Event Location
//            if (!location || location.trim().length === 0) {
//             errors.push('Event Location must not be empty');
//              }

//            // Validate Event Category
//            if (!category || category.trim().length === 0) {
//             errors.push('Event Category must not be empty');
//              }

//            // Validate Event Description
//            if (!description || description.trim().length === 0) {
//             errors.push('Event Description must not be empty');
//              }

//            // Validate Event Near By Port
//            if (!nearByPort || nearByPort.trim().length === 0) {
//             errors.push('Event Near By Port must not be empty');
//              }

//              // Validate Event Mode
//            if (!eventMode || eventMode.trim().length === 0) {
//             errors.push('Event Mode must not be empty');
//              }

            
//            // Validate Event Registration Fee
//            // it comes in as a string
//            if (!registrationFee || registrationFee.trim().length === 0) {
//             errors.push('Event Registration Fee must not be empty');
//              }
        
//             if (Number(registrationFee) <= 0 || !/^\d+(\.\d{1,2})?$/.test(registrationFee)) {
//                 errors.push('Event Registration Fee must be a number greater than 0 with up to 2 decimal places.');
//             }

//             if (errors.length > 0) {
//                 alert(errors.join('\n'));
//             }
            // } else {
            //     // When it checks the submit it takes away the value from the submission to the route
            //     // I have to add it back for the route to work.
            //     const action = event.submitter.value;
            //     eventForm.appendChild(action);
            //     eventForm.submit();
 
                // AJAX logic for form submission
                
                // fetch('/event/create', {
                //     method: 'POST',
                //     body: eventForm,
                // })
                // // .then(response => response.json())
                // .then(data => {
                //     if (data.success) {
                //     alert('Event created successfully!');
                //     window.location.href = '/event/';
                //     } else {
                //     alert('Error creating event');
                //     }
                // })
                // .catch(error => console.error('Error:', error));

            // }
    //     });
    // }

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
            if (!eventName || eventName.length > 100) {
                errors.push('Event Name should not be empty and upto 100 characters.');
            }

            // Category validation (Optional, so no strict validation)
            if (category != '' && category.length > 100) {
                errors.push('Category should be upto 100 characters.');
            }

            // Date validation (Optional field)
            const currentDate = new Date().toISOString().split('T')[0];
            if (date !== '' && date < currentDate) {
                errors.push('Please enter a valid future date for the event.');
            }            

            if (registrationFee !==''  &&  typeof registrationFee !== 'number') {
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
