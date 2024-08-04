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

// Function to create and show the modal
const showModal = () => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'modalOverlay';
    document.body.appendChild(overlay);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'breakModal';
    modal.innerHTML = `
        <h1>You should take a break!</h1>
        <button id="continueButton">Continue Scrolling</button>
    `;
    document.body.appendChild(modal);

    // Add event listener to the button
    document.getElementById('continueButton').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'showModal') {
        showModal();
    }
});
