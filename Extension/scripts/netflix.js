chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=> {
    if(msg.action === "getData"){
        sendResponse({message: document.title});
    }
    return true;
})