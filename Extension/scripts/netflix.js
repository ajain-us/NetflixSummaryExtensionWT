chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=> {
    if(msg.action === "netflix"){
        const episode = document.querySelector(".titleCardList--container.episode-item.current");
        const progress_bar = document.querySelector("span[class='summary']");
        const episodesPresent = document.querySelector('.episodeSelector-label');
        const title = document.title;
        if (title.includes("Home") || title.includes("TV Shows") || title.includes("Movies") || title === "Netflix"){
            sendResponse({message: "Not Valid"});
        }else{
            if (episode){
                sendResponse({title: title.replace(" - Netflix"), episode: episode.getAttribute("aria-label")});
            }else if(progress_bar && !episodesPresent){
                sendResponse({title:title.replace(" - Netflix"), progress: progress_bar.textContent})
            }else{
                sendResponse({title: title.replace(" - Netflix")});
            }
        }
        
    }
    return true;
})

