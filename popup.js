// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const findBtn = document.getElementById('findQuestionBtn');
  const resultContainer = document.getElementById('resultContainer');
  const highlightedAnswerElem = document.getElementById('highlightedAnswer');
  const explanationElem = document.getElementById('explanationText');
  const statusTextElem = document.getElementById('statusText');
  const themeToggle = document.getElementById('themeToggle');

  // --- Theme Logic ---
  chrome.storage.local.get('theme', ({ theme }) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    }
  });
  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    chrome.storage.local.set({ theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light' });
  });

  // --- Resilient function to send messages with retries ---
  async function sendMessageWithRetries(tabId, message, retries = 3, delay = 200) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await chrome.tabs.sendMessage(tabId, message);
        return response;
      } catch (error) {
        if (error.message.includes("Receiving end does not exist")) {
          if (i === retries - 1) { 
            throw error;
          }
          console.log(`Connection failed. Retrying... (${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  // --- Main Execution Logic ---
  findBtn.addEventListener('click', async () => {
  
    findBtn.disabled = true;
    findBtn.innerText = 'Working...';


    resultContainer.style.display = 'none';
    statusTextElem.style.display = 'block';
    statusTextElem.innerText = 'Detecting content...';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const content = await sendMessageWithRetries(tab.id, { action: "findContent" });

      let requestPayload = {};

      if (content && content.type === 'text') {
        statusTextElem.innerText = 'Found text. Asking AI...';
        requestPayload = { type: 'text', data: content.data };
      } else if (content && content.type === 'image') {
        statusTextElem.innerText = 'Found image. Asking AI...';
        requestPayload = { type: 'image', data: content.data, context: content.context };
      } else {
        statusTextElem.innerText = 'Nothing specific found. Taking screenshot...';
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
        requestPayload = { type: 'screenshot', data: screenshotDataUrl };
      }
      
      const aiResponse = await chrome.runtime.sendMessage({ action: "getAiAnswer", payload: requestPayload });
      
      if (aiResponse.error) throw new Error(aiResponse.error);

      if (aiResponse && aiResponse.answer) {
        highlightedAnswerElem.innerText = aiResponse.answer;
        explanationElem.innerText = aiResponse.explanation;
        resultContainer.style.display = 'block';
        statusTextElem.style.display = 'none';
      } else {
        throw new Error("Received an invalid response from the AI.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      statusTextElem.innerText = `Error: ${error.message}`;
    } finally {
   
      findBtn.disabled = false;
      findBtn.innerText = 'Find Answer';

    }
  });

});
