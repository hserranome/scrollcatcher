let scrollCount = 0;
const scrollThreshold = 10; // Number of scrolls before showing the message

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'incrementScroll') {
        console.log('incrementScroll', message)
        scrollCount++;
        if (scrollCount >= scrollThreshold) {
            chrome.action.setPopup({ popup: "popup.html" });
            chrome.action.openPopup();
            scrollCount = 0; // Reset the counter
        }
    }
});
