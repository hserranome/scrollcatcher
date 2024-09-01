const initialScrollLimit = window.innerHeight * 20;
const maxImageLevel = 4;

let scrollDistance = 0;
let scrollLimit = initialScrollLimit;
let modalDisplayed = false;
let warnings = 0;

console.debug('ScrollCatcher - Content script loaded');

function showModal() {
    if (!modalDisplayed) {
        modalDisplayed = true;
        const modal = document.createElement('div');
        modal.id = 'scroll-modal';
        const imageId = Math.min(warnings, maxImageLevel)
        const imageOriginalUrl = `assets/${imageId}.jpg`;
        const imageUrl = chrome.runtime ? chrome.runtime.getURL(imageOriginalUrl) : imageOriginalUrl;
        modal.innerHTML = `
        <div id="scroll-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; overflow: hidden;">
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 14px; text-align: center; color: black; display: flex; flex-direction: column; align-items: center;">
                <div class="modal-content-wrapper" style="display: flex; flex-direction: column; align-items: center; max-width: 600px;">
                    <h2 style="color: black; font-family: arial; font-weight: 800; margin: 0; margin-top: 0.2rem; margin-bottom: 1rem;">Scrolling a lot!</h2>
                    <p style="color: black; font-family: arial; font-weight: 600; margin: 0; margin-bottom: 1rem;">This is the warning number ${warnings + 1}. <br/> You've scrolled around ${Math.round(scrollDistance / window.innerHeight)} full height windows.</p>
                    ${`<img src="${imageUrl}" alt="Cat image" style="margin-bottom: 20px; width: 100%; border-radius: 14px;">`}
                    <div style="display: flex;">
                        <button id="dismiss-button" style="margin-top: 20px; 
                        display: inline-block;
                        outline: 0;
                        cursor: pointer;
                        border: 2px solid #000;
                        border-radius: 3px;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        color: #000;
                        background: #fff;
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 28px;
                        padding: 12px 20px;
                        text-align:center;
                        transition-duration: .15s;
                        transition-property: all;
                        transition-timing-function: cubic-bezier(.4,0,.2,1);
                        :hover{
                            background: rgb(251, 193, 245);
                        }        
                    ">Dismiss. I want to waste even more time scrolling.</button>
                    <button id="dismiss-button" style="margin-top: 20px; 
                    display: inline-block;
                    outline: 0;
                    cursor: pointer;
                    border: 2px solid #000;
                    border-radius: 3px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    color: #fff;
                    background: #000;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 28px;
                    padding: 12px 20px;
                    text-align:center;
                    transition-duration: .15s;
                    transition-property: all;
                    transition-timing-function: cubic-bezier(.4,0,.2,1);
                    :hover{
                        color: #000;
                        background: rgb(255, 218, 87);
                    }
                    ">I'm actually doing something productive or I just don't care. Don't bother me.</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('dismiss-button').onclick = function () {
            modal.remove();
            modalDisplayed = false;
            scrollLimit += initialScrollLimit / 2;
            scrollDistance = 0;
            warnings += 1;
        };
    }
}

window.addEventListener('scroll', (event) => {
    const newScroll = window.scrollY;
    if (newScroll > (window.oldScroll || 0)) {
        scrollDistance += newScroll - (window.oldScroll || 0);
    } else if (newScroll < (window.oldScroll || 0)) {
        scrollDistance -= (window.oldScroll || 0) - newScroll;
    }
    window.oldScroll = window.scrollY;
    if (scrollDistance >= scrollLimit) {
        showModal();
    }
});
