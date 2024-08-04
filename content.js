let scrollCount = 0;
const scrollLimit = 5; // Number of scrolls before showing the modal
let modalDisplayed = false;

function showModal() {
    if (!modalDisplayed) {
        modalDisplayed = true;
        const modal = document.createElement('div');
        modal.id = 'scroll-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Take a Break!</h2>
                <p>You've been scrolling a lot. Consider taking a break.</p>
                <button id="dismiss-button">Dismiss</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('dismiss-button').onclick = function() {
            modal.remove();
            modalDisplayed = false;
            scrollCount = 0; // Reset scroll count after dismissal
        };
    }
}

window.addEventListener('scroll', () => {
    scrollCount++;
    if (scrollCount >= scrollLimit) {
        showModal();
    }
});
