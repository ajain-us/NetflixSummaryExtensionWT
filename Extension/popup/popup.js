const output = document.getElementById("output")
const netflixButton = document.getElementById("netflix");
output.innerHTML = "working!"

async function callGemini(promptText) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`,
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
                output.innerHTML = "This is not netflix!";
            }else{
                if(response.episode && response.progress){
                    output.innerHTML = "Thinking!"
                    let result = await callGemini(`summarize ${response.title} up until episode ${response.episode}, keep it to 50 words`);
                    output.innerHTML = result;
                }else if(response.episode){
                    output.innerHTML = `Title: ${response.title}, Episode: ${response.episode}`;
                }else if(response.progress){
                    let result = await callGemini(`summarize ${response.title} up until ${response.progress}, keep it to 50 words`);
                    //output.innerHTML = `Title: ${response.title}, Progress: ${response.progress}`;
                    output.innerHTML = result;
                }else{
                    output.innerHTML = `Title: ${response.title}`;
                }
            }
            
        }));
    });
});