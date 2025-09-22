
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
   
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

   
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        clearTimeout(timer);
        resolve(element);
      }
    }, 200); 

    const timer = setTimeout(() => {
      clearInterval(interval);
   
      resolve(null); 
    }, timeout);
  });
}


async function findTargetData() {

  const mainContainer = await waitForElement('#TopContentDiv');

  
  if (!mainContainer) {
    return { type: 'nothing_found' };
  }


  let passageText = '';
  let questionText = '';
  let imageSrc = null;

  const passageElement = mainContainer.querySelector('#divPassageText');
  if (passageElement && passageElement.offsetParent !== null) {
    passageText = passageElement.innerText.trim();
  }

  const questionElement = mainContainer.querySelector('#lblQuestion');
  if (questionElement) {
    const imageElement = questionElement.querySelector('img');
    if (imageElement) {
      imageSrc = imageElement.src;
    } else {
      const paragraphs = questionElement.querySelectorAll('p');
      if (paragraphs && paragraphs.length > 0) {
        questionText = Array.from(paragraphs).map(p => p.innerText).join('\n').trim();
      } else {
        questionText = questionElement.innerText.trim();
      }
    }
  }

  if (imageSrc) {
    return { type: 'image', data: imageSrc, context: passageText };
  } else if (questionText) {
    const combinedText = passageText ? `Context Passage:\n${passageText}\n\nQuestion:\n${questionText}` : questionText;
    return { type: 'text', data: combinedText };
  } else {
    return { type: 'nothing_found' };
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "findContent") {
    findTargetData().then(sendResponse);
    return true;
  }

});
