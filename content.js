let scrollDistance = 0;
let scrollLimit = 500; // Initial scroll distance in pixels before showing the modal
let modalDisplayed = false;
const maxLevel = 2;
const currLevel = 0

function showModal() {
    if (!modalDisplayed) {
        modalDisplayed = true;
        document.body.style.overflow = 'hidden'; // Disable scrolling
        const modal = document.createElement('div');
        modal.id = 'scroll-modal';
        modal.innerHTML = `
        <div id="scroll-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; overflow: hidden;">
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 5px; text-align: center; color: black; display: flex; flex-direction: column; align-items: center;">
                <h2 style="margin-bottom: 20px; color: black;">Take a Break!</h2>
                <p style="margin-bottom: 20px; color: black;">You've been scrolling a lot. Consider taking a break.</p>
                <img src="assets/${currLevel}.jpg" alt="Take a break image" style="margin-bottom: 20px;">
                <button id="dismiss-button" style="margin-top: 20px;">Dismiss</button>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('dismiss-button').onclick = function () {
            modal.remove();
            document.body.style.overflow = ''; // Re-enable scrolling
            modalDisplayed = false;
            scrollLimit += 500; // Increase the scroll limit by 500 pixels after dismissal
            scrollDistance = 0; // Reset scroll distance after dismissal
            currLevel += 1;
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
