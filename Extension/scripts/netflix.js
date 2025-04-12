chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=> {
    if(msg.action === "netflix"){
        const episode = document.querySelector(".titleCardList--container.episode-item.current");
        if (episode){
            sendResponse({title: document.title.split("-")[0], episode: episode.getAttribute("aria-label")});
        }else{
            sendResponse({title: "bad :("})
        }
    }
    return true;
})

