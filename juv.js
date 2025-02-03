function submitForm() {
    const form = document.getElementById('customer-form');
    if (form.checkValidity()) {
        // Here you would handle form submission, e.g., save to database or send email
        alert('Form submitted successfully!');
    } else {
        alert('Please fill in all required fields.');
    }
}
