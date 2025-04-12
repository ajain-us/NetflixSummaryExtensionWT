const output = document.getElementById("output")
const netflixButton = document.getElementById("netflix");
output.innerHTML = "working!"



netflix.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {action: "netflix"}, (response => {
            if (chrome.runtime.lastError) {
                output.innerHTML = "No content script found special!";
            }else{
                output.innerHTML = `Title: ${response.title}, Episode: ${response.episode}`;
            }
            
        }));
    });
});