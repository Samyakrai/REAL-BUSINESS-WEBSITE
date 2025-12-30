// Basic Navigation and dynamic logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the registration page
    if (window.location.pathname.includes('register.html')) {
        loadCourseDetails();
    }
});

// Function to handle course selection from courses.html
function selectCourse(courseName, coursePrice) {
    // Save course details to localStorage to persist across pages
    localStorage.setItem('selectedCourseName', courseName);
    localStorage.setItem('selectedCoursePrice', coursePrice);
    
    // Redirect to registration page
    window.location.href = 'register.html';
}

// Function to load course details on register.html
function loadCourseDetails() {
    const courseName = localStorage.getItem('selectedCourseName');
    const coursePrice = localStorage.getItem('selectedCoursePrice');

    const nameDisplay = document.getElementById('display-course-name');
    const feeDisplay = document.getElementById('display-course-fee');

    if (courseName && coursePrice) {
        nameDisplay.innerText = courseName;
        feeDisplay.innerText = '₹ ' + coursePrice;
    } else {
        nameDisplay.innerText = 'No Course Selected';
        feeDisplay.innerText = '-';
    }
}

// Handle Registration Form Submission
function handleRegistration(event) {
    event.preventDefault(); // Prevent actual form submission

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const courseName = localStorage.getItem('selectedCourseName');

    if (!courseName) {
        alert('Please select a course first!');
        window.location.href = 'courses.html';
        return;
    }

    if (name && phone && email && dob) {
        // success simulation
        alert(`Payment Successful!\n\nRegistered for: ${courseName}\nName: ${name}\nEmail: ${email}\n\nWelcome to RISE UP!`);
        // Optional: clear Storage or redirect to home
        localStorage.removeItem('selectedCourseName');
        localStorage.removeItem('selectedCoursePrice');
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all details.');
    }
}

// Handle Feedback Form Submission
function handleFeedback(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    if (name && message) {
        alert(`Thank you, ${name}! We have received your feedback.`);
        document.getElementById('feedback-form').reset();
    }
}
