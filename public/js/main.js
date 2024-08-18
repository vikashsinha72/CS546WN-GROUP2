// import { changePassword } from "../../data/users";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const eventForm = document.getElementById('eventCreation-form');
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
            
            if (!newPassword || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[^\s]{8,}$/.test(newPassword)) {
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
        let publish = eventForm.querySelector('#pubStat').value.trim();
        
        try {

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

        // validate pubstat
        if (event.submitter.matches('button#saveStat')) {
            publish = 'save';
        }

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
                    pubStat: publish
                    // contactPersonInput :  contactPerson
                })
              };

            //Make AJAX Call
            $.ajax(requestConfig)
            .done((response) => {
                // `response` is already parsed JSON
                alert("Create Event: " + JSON.stringify(response))

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
            alert("eventForm submit: [Contact Admin]" +e);
        }

        }

    } catch (error) {
        alert("eventForm: [Contact Admin] " + error);

    }
    });
}



//Event Search
if (eventSearchform) {
    eventSearchform.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];

        // Get form values
        //const eventName = document.getElementById('eventNameInput').value.trim();
        const eventName = eventSearchform.querySelector('#eventNameInput').value.trim();
        const category = eventSearchform.querySelector('#categoryInput').value.trim();
        const date = eventSearchform.querySelector('#dateInput').value;
        const registrationFee = eventSearchform.querySelector('#registrationFeeInput').value;


        // Event Name validation (Optional, so no strict validation)
        if (!eventName && eventName.length > 100) {
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

        
        let price = 0.00;
        if(registrationFee)
            price = parseFloat(registrationFee); // Convert the string to a number

        if ( isNaN(price)) {
            errors.push('Please enter a valid numeric fee value.');
        }            
        price = "0.00";

        if (errors.length > 0) {
            alert(errors.join('\n'));
        } else {
            //eventSearchform.submit();

            // AJAX logic for form submission

            let requestConfig = {
                method: 'POST',
                url: '/event/search',
                contentType: 'application/json',
                data: JSON.stringify({
                    eventNameInput: eventName,
                    categoryInput: category,
                    dateInput: date,
                    registrationFeeInput: price 
                })
              };


            //Make AJAX Call

            $.ajax(requestConfig)
            .done((response) => {
                // `response` is already parsed JSON

                if (response.success) {
                    // Handle successful search results
                    const userId = document.getElementById('userSession-form').querySelector('#userId').value.trim();

                    displaySearchResults(response.events, userId);
                } else {
                    alert(`Error in searching events:  ${response.error}`);

                }
            })
            .fail((e) => {
                console.error('Error:', e);
                const parsedResponse = JSON.parse(e.responseText);
                alert(`An error occurred while searching for events. : ${parsedResponse.error}` );
            });

        }
    });
}
//Search End


});



function displaySearchResults(results,  userId) {
    try{
    const searchResultsDiv = document.getElementById('eventSearchList');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsDiv.innerHTML = '<p>No events found matching your criteria.</p>';
    } else {
        results.forEach(event => {
            const formattedDate = formatDate(event.eventDate);
            // Check if the user is subscribed to the event
            const isSubscribed = event.subscribers.includes(userId);

            // Check if the user has already submitted a review for the event
            const hasReviewed = event.reviews.some(review => review.userId === userId);

            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-card';

            eventDiv.innerHTML = `
            <div class="event-card-header">
                <h3>${event.eventName}</h3>
            </div>
            <div class="event-card-body">
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Registration Fee:</strong> ${event.registrationFee}</p>
                <p><strong>Rating:</strong> ${event.averageRating}</p>
            </div>
            <div class="event-card-footer">
                <div class="subscription-section">
                    ${isSubscribed ? 
                        `<span class="subscribed-label">Subscribed</span>` :
                        `<a href="#" class="subscribe-button" data-event-id="${event._id}">Subscribe</a>`
                    }
                </div>
                <div class="review-section">
                    ${hasReviewed ? 
                        `<span class="reviewed-label">Reviewed</span>` :
                        `<form class="review-form" data-event-id="${event._id}">
                            <label for="reviewComment-${event._id}">Comment:</label>
                            <textarea id="reviewComment-${event._id}" name="reviewComment" rows="2" required></textarea>
                            <div class="rating-section">
                                <label>Rating:</label>
                                ${generateRatingRadioButtons(event._id)}
                            </div>
                            <button type="submit" class="review-submit-button">Submit Review</button>
                        </form>`
                    }
                </div>
            </div>
        `;
            searchResultsDiv.appendChild(eventDiv);
            searchResultsDiv.style.display = 'inline-block'; // or 'flex', 'block'


            // Event listener for subscription
            const subscribeButton = eventDiv.querySelector('.subscribe-button');
            if (subscribeButton) {
                subscribeButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    const eventId = this.getAttribute('data-event-id');
                    handleSubscription(this, eventId);
                });
            }

            // Event listener for review submission
            const reviewForm = eventDiv.querySelector('.review-form');
            if (reviewForm) {
                reviewForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const eventId = this.getAttribute('data-event-id');
                    const reviewComment = this.querySelector('textarea').value;
                    const rating = this.querySelector('input[name="ratingInput"]:checked').value;
                    //const rating = this.querySelector("ratingInput").value;
                    handleReviewSubmission(this, eventId, reviewComment, rating);
                });
            }
        });
    }

}catch(e)
{
alert("displaySearchResults: " +e)
}

}

// AJAX call for subscription
function handleSubscription(subscriptionForm, eventId) {
    $.ajax({
        url: `/event/subscribe/${eventId}`,
        type: 'POST',
        success: function(response) {
            if (response.success) {
                // update the UI to reflect subscription
                try {
                    updateSubscriptionCard(subscriptionForm);

                } catch (error) {
                    alert("handleSubscription success: [Contact admin] :"  + error);
                }            }
        },
        error: function(xhr) {
            alert(`Error subscribing: ${xhr.responseText}`);
        }
    });
}

// AJAX call for review submission
function handleReviewSubmission(reviewForm, eventId, reviewCommentInput, ratingInput) {
    $.ajax({
        url: `/event/review/${eventId}`,
        type: 'POST',
        data: { reviewCommentInput, ratingInput },
        success: function(response) {
            if (response.success) {
                // update the UI to reflect reviewed
                try {
                    updateEventCard(reviewForm);

                } catch (error) {
                    alert("handleReviewSubmission success: [Contact admin] :"  + error);
                }
            }
        },
        error: function(xhr) {
            alert(`Error submitting review: ${xhr.responseText}`);
        }
    });
}


// Function to format the date to "mm/dd/yyyy"
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Function to generate rating radio buttons (1 to 5)
function generateRatingRadioButtons(eventId) {
    let ratingHtml = '<div class="rating-buttons">';
    for (let i = 1; i <= 5; i++) {
        ratingHtml += `
            <label for="rating${i}-${eventId}" class="rating-label">${i}</label>
            <input type="radio" id="rating${i}-${eventId}" name="ratingInput" value="${i}"  ${i===1 ? "checked" :""} required>
        `;
    }
    ratingHtml += '</div>';
    return ratingHtml;
}


// Function to update the specific event in the UI
function updateEventCard(reviewForm) {
    try {

    const eventDiv = reviewForm;

    if (eventDiv) {
        eventDiv.innerHTML = ''; // Clear Form
        eventDiv.innerHTML = `<span class="reviewed-label">Reviewed</span>`;
    }
    } catch (error) {
        alert("updateEventCard: [Contact Admin to report] " + error);

    }
}

// Function to update the specific Su in the UI
function updateSubscriptionCard(subscriptionLink) {
    try {
    
    if (subscriptionLink) {
        subscriptionLink.innerHTML = ''; // Clear html  
        subscriptionLink.parentElement.innerHTML =  `<span class="subscribed-label">Subscribed</span>`;
    }
    } catch (error) {
        alert("updateSubscriptionCard: [Contact Admin to report] " + error);

    }
}
