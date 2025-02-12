# Weather App

A simple webpage for weather details using HTML, CSS, and JavaScript.

## Table of Contents
1. [Instructions for Running the Project Locally](#instructions-for-running-the-project-locally)
2. [Approach](#approach)
3. [Challenges Faced](#challenges-faced)
4. [Solutions](#solutions)

---

## Instructions for Running the Project Locally

To run this project locally, follow these steps:

### Prerequisites

- Ensure you have a web browser installed (Chrome, Firefox, Safari, etc.).
- You don't need any special development tools for this project. It's a static webpage made with HTML, CSS, and JavaScript.

### Steps

1. **Clone the repository**:
   If you have Git installed, you can clone the project repository:

   ```bash
   git clone https://github.com/ketan13089/weather-app.git

---

## Approach

## HTML
The page consists of a simple structure: a search bar for entering the city name, an area to display the weather information, and a button to fetch the data.
The HTML file includes the necessary elements for displaying the weather (e.g., temperature, weather conditions) dynamically.
## CSS
Responsive Design: The app is styled to be mobile-friendly using CSS Flexbox.
Typography and Colors: The app uses simple typography and color schemes for a clean look. The background adjusts depending on the weather conditions (e.g., sunny, rainy).
Interactive Elements: Buttons and input fields have hover and focus effects to improve the user experience.
## JavaScript
API Integration: The JavaScript code interacts with the OpenWeatherMap API to fetch weather data based on the city entered by the user or their current location.
DOM Manipulation: The data fetched from the API is inserted dynamically into the webpage using JavaScript.
Error Handling: If the city is not found or the API request fails, the app displays an appropriate error message.

---

## Challenges faced

### Handling API Response and Errors
When dealing with user input, the app had to handle cases where the API did not return valid data.

### Responsive Design for Mobile Devices
Making the app look good on different screen sizes, particularly mobile devices, was initially challenging.

### Fetching Data from the API
Handling asynchronous API requests and ensuring data is displayed correctly was challenging.

---

## Solutions

- Implemented error handling in JavaScript to display user-friendly messages when the city is not found or the API request fails.
- Used CSS Flexbox to create a responsive layout that adjusts based on the screen size. This ensures the weather information looks good on both mobile and desktop screens.
- Used the fetch API and async/await to manage asynchronous operations and display data only after it has been successfully fetched.

