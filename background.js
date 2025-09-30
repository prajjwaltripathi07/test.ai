const API_KEY = "AIzaSyCcGpruP1qQKABrbh1s1c3G7kY90QBlz8Y";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// A helper function to fetch an image URL and convert it to a base64 string
async function imageUrlToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getAiResponse(payload) {
  console.log(`[${new Date().toLocaleTimeString()}] MAKING API CALL. Type: ${payload.type}`);
  let prompt;
  let imageParts = [];

  try {
    if (payload.type === 'text') {
      prompt = `Analyze the following text and provide a direct answer and a step-by-step explanation. Respond ONLY with a valid JSON object in the format: {"answer": "The correct option", "explanation": "Your explanation"}\n\n${payload.data}`;
    } else {
      if (payload.type === 'screenshot') {
        prompt = "From this screenshot, find the primary question and provide its correct answer and a step-by-step explanation. Respond ONLY with a valid JSON object in the format: {\"answer\": \"The correct option\", \"explanation\": \"Your explanation\"}";
        imageParts.push({ inline_data: { mime_type: "image/png", data: payload.data.split(',')[1] } });
      } else { // type is 'image'
        prompt = `Using the following image, and the context passage if provided, answer the question. Respond ONLY with a valid JSON object in the format: {"answer": "The correct option", "explanation": "Your explanation"}\n\nContext: ${payload.context || 'None'}`;
        
        // --- THIS IS THE FIX ---
        // Fetch the image from the URL and convert it to base64
        const imageData = await imageUrlToBase64(payload.data);
        imageParts.push({ inline_data: { mime_type: "image/png", data: imageData } });
        // --- END OF FIX ---
      }
    }

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }, ...imageParts]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Could not parse text from API response.");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { answer: rawText, explanation: "(AI did not provide a structured response)" };
    }
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("API call error:", error);
    return { error: error.message };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAiAnswer") {
    getAiResponse(request.payload).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
});