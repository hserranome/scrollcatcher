let scrollDistance = 0;
let scrollLimit = 500; // Initial scroll distance in pixels before showing the modal
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
            scrollLimit += 500; // Increase the scroll limit by 500 pixels after dismissal
            scrollDistance = 0; // Reset scroll distance after dismissal
        };
    }
}

window.addEventListener('scroll', (event) => {
    scrollDistance += Math.abs(window.scrollY - (window.oldScroll || 0));
    window.oldScroll = window.scrollY;
    if (scrollDistance >= scrollLimit) {
        showModal();
    }
});
