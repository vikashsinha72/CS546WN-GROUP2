// import { changePassword } from "../../data/users";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const eventForm = document.getElementById('eventCreation-form');
    const eventEditForm = document.getElementById('eventEdit-form');
    const eventSearchform = document.getElementById('eventSearch-form');
    const changePasswordForm = document.getElementById('password-form');


    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = [];


            const password = document.getElementById('passwordInput').value.trim();
            const newPassword = document.getElementById('newPasswordInput').value.trim();
            const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();

            if (!password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]{8,}$/.test(password)) {
                errors.push('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.');
            }
            
            if (!newPassword || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]{8,}$/.test(newPassword)) {
                errors.push('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.');
            }

            if (newPassword === password) {
                errors.push('Passwords must be different.');
            }

             // Validate Confirm Password
            if (newPassword !== confirmPassword) {
                errors.push('Passwords do not match.');
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
            } else {
                changePasswordForm.submit();
            }

        })
    }

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

// Event Creation form
if (eventForm) {
    eventForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];

        const eventName = eventForm.querySelector('#eventNameInput').value.trim();
        const eventDate = eventForm.querySelector('#dateInput').value.trim();
        const location = eventForm.querySelector('#locationInput').value.trim();
        const category = eventForm.querySelector('#categoryInput').value.trim();
        const description = eventForm.querySelector('#descriptionInput').value.trim();
        const nearByPort = eventForm.querySelector('#portInput').value.trim();
        const eventMode = eventForm.querySelector('#modeInput').value.trim();
        const registrationFee = eventForm.querySelector('#feeInput').value.trim();
        const publish = eventForm.querySelector('#pubStat').value.trim();
        const save = eventForm.querySelector('#saveStat').value.trim();
        // const contactPerson = eventForm.querySelector('#contactPersonInput').value.trim();


        // Validate Event Name
        if (!eventName || eventName.length === 0) {
            errors.push('Event Name must not be empty :' + eventName);
        }

        // Event Date validation (check if the date is not in the past)
        const currentDate = new Date().toISOString().split('T')[0];

        if (!eventDate  || eventDate <=  currentDate ) {
            isValid = false;
            errors.push('Please enter a valid future date for the event.');
        }


       // Validate Event Location
       if (!location || location.length === 0) {
        errors.push('Event Location must not be empty:' + location);
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


         price = parseFloat(registrationFee); // Convert the string to a number

         if (!registrationFee || isNaN(price)) {
             errors.push('Please enter a valid numeric fee value.');
         }  
    
        if (registrationFee < 0 || !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
            errors.push('Event Registration Fee must be not be negative and up to 2 decimal places.');
        }

        
       // Validate Event Contact Person
    //    if (!contactPerson || contactPerson.trim().length === 0) {
    //     errors.push('Event Contact Person must not be empty');
    //      }


        if (errors.length > 0) {
            alert(errors.join('\n'));
        } else {
            //registerForm.submit();
            try{
            // AJAX logic for form submission
            let requestConfig = {
                method: 'POST',
                url: '/event/create',
                contentType: 'application/json',
                data: JSON.stringify({
                    eventNameInput: eventName,
                    dateInput: eventDate,
                    locationInput : location ,
                    categoryInput: category,
                    descriptionInput : description,
                    portInput :  nearByPort,
                    modeInput : eventMode,
                    feeInput : registrationFee,
                    pubStat: publish ? publish : save
                    // contactPersonInput :  contactPerson
                })
              };

            //Make AJAX Call
            $.ajax(requestConfig)
            .done((response) => {
                // `response` is already parsed JSON

                if (response.success) {
                    // Handle successful search results
                    //displaySearchResults(response.events);
                    // alert(`${response.event.eventName} Event created sussessfully.`);
                    window.location.href = `/event/${response.event}`;

                } else {

                    alert(`Error in creating event : ${response.error}`);
                }
            })
            .fail((error) => {
                const parsedResponse = JSON.parse(error.responseText);
                alert(`An error occurred while creating event. : ${parsedResponse.error}` );
            });

        }catch(e)
        {
            alert("eventForm: " +e);
        }

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
