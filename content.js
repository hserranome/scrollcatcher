// Function to send scroll increment message to the background script
const sendScrollMessage = () => {
    chrome.runtime.sendMessage({ type: 'incrementScroll' });
};

// Add event listeners for various scrolling inputs
window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        sendScrollMessage();
    }
});
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        sendScrollMessage();
    }
});