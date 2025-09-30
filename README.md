# OLTExtension-


-----


A proof-of-concept Chrome Extension designed to extract text-based questions from a specific webpage, send them to the Google Gemini AI for a solution, and display the answer directly in the browser.

This project is intended for ed# OLTExtension-


-----


A proof-of-concept Chrome Extension designed to extract text-based questions from a specific webpage, send them to the Google Gemini AI for a solution, and display the answer directly in the browser.

This project is intended for educational purposes to demonstrate the integration of browser extension APIs, DOM manipulation, and generative AI.

## Key Features

  * **Intelligent Text Extraction**: Parses the webpage's HTML to specifically isolate the question and its multiple-choice options.
  * **Image Detection**: Gracefully handles questions that are images instead of text, preventing errors.
  * **AI Integration**: Communicates securely with the Google Gemini API via a background service worker.
  * **Simple UI**: Provides a clean popup interface to trigger the process and display results.

-----

## How It Works

The extension operates through a coordinated effort between its main components:

1.  **Popup Script (`popup.js`)**: Acts as the user-facing control center. When the user clicks the "Find Question & Answer" button, it initiates the process.
2.  **Content Script (`content.js`)**: Injected into the webpage, it listens for a request from the popup. It then scans the page's DOM, extracts the question and options from the `#lblQuestion` element, and sends the structured data back.
3.  **Background Script (`background.js`)**: Receives the extracted data from the popup. It formats a prompt, securely adds the API key, calls the Google Gemini API, and returns the final answer.

The data flow is: **Popup -\> Content Script -\> Popup -\> Background Script -\> Popup**.

-----

## Setup and Installation

To use this extension, follow these steps:

### 1\. Configuration

Before installing, you must add your API key.

1.  Get a free API key from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.

2.  Open the `background.js` file.

3.  Replace the placeholder text `"YOUR_API_KEY_HERE"` with your actual API key.

    ```javascript
    // in background.js
    const API_KEY = "YOUR_API_KEY_HERE";
    ```

### 2\. Installation

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable the **Developer mode** toggle in the top-right corner.
4.  Click the **Load unpacked** button and select the project folder.
5.  The extension's icon will appear in your Chrome toolbar, ready to use.

-----
NOTE -> DON'T USE MUCH FOR IMAGE TYPE QUESTIONS , IT WILL LOAD YOUR API CALLS WITH LIMIT . 
## ⚠️ Disclaimer


This tool is for **educational and proof-of-concept purposes only**. Using such a tool to cheat on tests, exams, or any form of assessment is a violation of academic integrity and the terms of service of most platforms. The creator of this repository is not responsible for any misuse of this software.
ucational purposes to demonstrate the integration of browser extension APIs, DOM manipulation, and generative AI.

## Key Features

  * **Intelligent Text Extraction**: Parses the webpage's HTML to specifically isolate the question and its multiple-choice options.
  * **Image Detection**: Gracefully handles questions that are images instead of text, preventing errors.
  * **AI Integration**: Communicates securely with the Google Gemini API via a background service worker.
  * **Simple UI**: Provides a clean popup interface to trigger the process and display results.

-----

## How It Works

The extension operates through a coordinated effort between its main components:

1.  **Popup Script (`popup.js`)**: Acts as the user-facing control center. When the user clicks the "Find Question & Answer" button, it initiates the process.
2.  **Content Script (`content.js`)**: Injected into the webpage, it listens for a request from the popup. It then scans the page's DOM, extracts the question and options from the `#lblQuestion` element, and sends the structured data back.
3.  **Background Script (`background.js`)**: Receives the extracted data from the popup. It formats a prompt, securely adds the API key, calls the Google Gemini API, and returns the final answer.

The data flow is: **Popup -\> Content Script -\> Popup -\> Background Script -\> Popup**.

-----

## Setup and Installation

To use this extension, follow these steps:

### 1\. Configuration

Before installing, you must add your API key.

1.  Get a free API key from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.

2.  Open the `background.js` file.

3.  Replace the placeholder text `"YOUR_API_KEY_HERE"` with your actual API key.

    ```javascript
    // in background.js
    const API_KEY = "YOUR_API_KEY_HERE";
    ```

### 2\. Installation

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable the **Developer mode** toggle in the top-right corner.
4.  Click the **Load unpacked** button and select the project folder.
5.  The extension's icon will appear in your Chrome toolbar, ready to use.

-----
NOTE -> DON'T USE MUCH FOR IMAGE TYPE QUESTIONS , IT WILL LOAD YOUR API CALLS WITH LIMIT . 
## ⚠️ Disclaimer


This tool is for **educational and proof-of-concept purposes only**. Using such a tool to cheat on tests, exams, or any form of assessment is a violation of academic integrity and the terms of service of most platforms. The creator of this repository is not responsible for any misuse of this software.
