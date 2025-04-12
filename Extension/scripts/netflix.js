chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=> {
    if(msg.action === "netflix"){
        const episode = document.querySelector(".titleCardList--container.episode-item.current");
        const progress_bar = document.querySelector("span[class='summary']");
        const title = document.title;
        if (title.includes("Home") || title.includes("TV Shows") || title.includes("Movies") || title === "Netflix"){
            sendResponse({title: "Please select a TV show or Movie Page!"});
        }else{
            if(episode && progress_bar){
                sendResponse({title: title.split("-")[0], episode: episode.getAttribute("aria-label"), progress: progress_bar.textContent});
            }else if (episode){
                sendResponse({title: title.split("-")[0], episode: episode.getAttribute("aria-label")});
            }else if(progress_bar){
                sendResponse({title:title.split("-")[0], progress: progress_bar.textContent})
            }else{
                sendResponse({title:title})
            }
        }
        
    }
    return true;
})

