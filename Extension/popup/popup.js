const output = document.getElementById("output")
const netflixButton = document.getElementById("netflix");
const statusHeader = document.getElementById("status");


async function callGemini(promptText) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

netflix.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {action: "netflix"}, (async response => {
            if (chrome.runtime.lastError) {
                status.innerHTML = "This is not netflix!";
            }else{
                if(response.episode && response.progress){
                    statusHeader.innerHTML = `Current Title: ${response.title} \n Current Episode: ${response.episode}`;
                    let result = await callGemini(`summarize ${response.title} up until episode ${response.episode}, keep it to 100 words`);
                    output.innerHTML = result;
                    output.removeAttribute("hidden")
                }else if(response.episode){
                    statusHeader.innerHTML = `Current Title: ${response.title}\n Current Episode: ${response.episode}`;
                    let result = await callGemini(`summarize ${response.title} up until episode ${response.episode}, keep it to 100 words`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result; 
                }else if(response.progress){
                    statusHeader.innerHTML = `Current Title: ${response.title} \n No Episode Found`;
                    let result = await callGemini(`summarize ${response.title} up till ${response.progress} keep it to 100 words`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result;
                }else if(response.title){
                    statusHeader.innerHTML = `Current Title: ${response.title}\n Could not find episode or progress!`;
                    let result = await callGemini(`summarize ${response.title}, keep it to 100 words`);
                    output.removeAttribute("hidden")
                    output.innerHTML = result;

                }else{
                    statusHeader.innerHTML = `Not on a valid page!`;
                }
            }
            
        }));
    });
});