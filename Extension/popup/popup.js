const testButton = document.getElementById("getData");
const output = document.getElementById("output")
output.innerHTML = "working!"

testButton.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {action: "getData"}, (response => {
            if (chrome.runtime.lastError) {
                output.innerHTML = "No content script found.";
            }else{
                output.innerHTML = response.message
            }
            
        }));
    });
});