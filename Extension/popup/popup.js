const output = document.getElementById("output");
const netflixButton = document.getElementById("netflix");
const statusHeader = document.getElementById("status");
const reviewButton = document.getElementById("review");
const enterButton = document.getElementById("enter");
const setup = document.getElementById("setup");
const main = document.getElementById("main");
const api_enter = document.getElementById("api-key");
let api = undefined;
chrome.storage.local.get('GeminiKey').then((data) => {
   api = data.GeminiKey;
   console.log(api);
   if (api){
        main.removeAttribute("hidden");
    }else{
        setup.removeAttribute("hidden");
    }
});

async function callGemini(promptText) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${api}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );
  
    const data = await response.json();
    console.log(data);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}


async function testGemini(key) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }]
        })
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return true;
  } catch (error) {
    return false;
  }
}




netflix.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "netflix"}, (async response => {
            if (chrome.runtime.lastError) {
                statusHeader.innerHTML = "This is not Netflix!";
            } else {
                if (response.episode && response.progress) {
                    statusHeader.innerHTML = `Currently Summarizing: ${response.title} \n Current Episode: ${response.episode}`;
                    let result = await callGemini(`summarize what is going on in ${response.title} up until episode ${response.episode}, keep it to a short length and do not discuss events after the episode, no markdown`);
                    output.innerHTML = result;
                    output.removeAttribute("hidden");
                } else if (response.episode) {
                    statusHeader.innerHTML = `Currently Summarizing: ${response.title}\n Current Episode: ${response.episode}`;
                    let result = await callGemini(`summarize what is going on in ${response.title} up until episode ${response.episode} keep it to a short length and do not discuss events after the episode, no markdown`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result; 
                } else if (response.progress) {
                    statusHeader.innerHTML = `Currently Summarizing: ${response.title} \n Progress: ${response.progress}`;
                    let result = await callGemini(`summarize what is going on in ${response.title} up till ${response.progress} keep it to a medium length and do not discuss events after the point, no markdown`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result;
                } else if (response.title) {
                    statusHeader.innerHTML = `Current Summarizing: ${response.title}\n No Current Episode or Progress!`;
                    let result = await callGemini(`Summarize what is going on in ${response.title} keep it to a medium length and do not discuss events after the episode, no markdown`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result;

                }
            }
            
        }));
    });
});

reviewButton.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "netflix"}, (async response => {
            if (chrome.runtime.lastError) {
                statusHeader.innerHTML = "This is not Netflix!";
            } else {
                if (response.title) {
                    statusHeader.innerHTML = `Currently Reviewing: ${response.title}`;
                    let result = await callGemini(`give a review of ${response.title}, keep it to 100 words, go easy on children shows, give it a star rating at the end out of 5 and no markdown please`);
                    output.removeAttribute("hidden");
                    output.innerHTML = "\t" + result;
                }
            }
        }));
    });
});

enterButton.addEventListener("click", async () =>{
     try {
        const isValid = await testGemini(api_enter.value);
        if (isValid) {
            await chrome.storage.local.set({ "GeminiKey": api_enter.value });
            setup.setAttribute("hidden", "");
            main.removeAttribute("hidden");
            console.log("Done");
        } else {
            console.log("Enter a valid API key");
        }
    } catch (err) {
        console.error("Error validating key:", err);
    }
});