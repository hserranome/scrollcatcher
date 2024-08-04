let scrollCount = 0;
const scrollLimit = 5; // Number of scrolls before showing the modal
let modalDisplayed = false;

function showModal() {
    if (!modalDisplayed) {
        modalDisplayed = true;
        const modal = document.createElement('div');
        modal.id = 'scroll-modal';
        modal.innerHTML = `
        <div id="scroll-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; overflow: hidden;">
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                <h2>Take a Break!</h2>
                <p>You've been scrolling a lot. Consider taking a break.</p>
                <button id="dismiss-button">Dismiss</button>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('dismiss-button').onclick = function () {
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
