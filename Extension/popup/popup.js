const output = document.getElementById("output")
const netflixButton = document.getElementById("netflix");
output.innerHTML = "working!"



netflix.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {action: "netflix"}, (response => {
            if (chrome.runtime.lastError) {
                output.innerHTML = "This is not netflix!";
            }else{
                if(response.episode){
                    output.innerHTML = `Title: ${response.title}, Episode: ${response.episode}`;
                }else if(response.progress){
                    output.innerHTML = `Title: ${response.title}, Progress: ${response.progress}`;
                }else{
                    output.innerHTML = `Title: ${response.title}`;
                }
            }
            
        }));
    });
});