// Utils and constants
const defaultUnit = "screens";
const defaultAmount = 15;
const defaultWhitelistedDomains = [
	"youtube.com",
	"facebook.com",
	"twitter.com",
	"instagram.com",
	"x.com",
	"tiktok.com",
];

const maxImageLevel = 4;
const testDomain = "html.spec.whatwg.org, ";

// Utils
const getPixelsPerInch = () => {
	const div = document.createElement("div");
	div.style.width = "1in";
	div.style.height = "1in";
	div.style.position = "absolute";
	div.style.left = "-100%"; // Hide it
	document.body.appendChild(div);
	const ppi = div.clientWidth;
	document.body.removeChild(div);
	return ppi;
};
const getPixelsPerCm = () => getPixelsPerInch() / 2.54;
const cmToPixels = (cm) => cm * getPixelsPerCm();
const getScrollLimit = (unit, amount) => {
	if (unit === "cm") return cmToPixels(amount);
	if (unit === "screens") return window.innerHeight * amount;
	return cmToPixels(500);
};
const getValues = async () => {
	let values = {};
	await chrome.storage.local.get(["unit", "amount", "domains"], (result) => {
		values = {
			unit: result.unit || defaultUnit,
			amount: result.amount || defaultAmount,
			domains: result.domains || defaultWhitelistedDomains.join(", "),
		};
	});
	return values;
};
const currentTabIsWhitelisted = async (domains) => (testDomain + domains).includes(window.location.hostname);

// Init
const init = async () => {
	const { unit, amount, domains } = await getValues();
	if (!(await currentTabIsWhitelisted(domains))) return;
	const initialScrollLimit = getScrollLimit(unit, amount);

	let scrollLimit = initialScrollLimit;
	let scrollDistance = 0;
	let modalDisplayed = false;
	let warnings = 0;

	const handleScroll = () => {
		const newScroll = window.scrollY;

		// if scrolling down, add scroll distance
		if (newScroll > (window.oldScroll || 0)) scrollDistance += newScroll - (window.oldScroll || 0);
		// if scroll up, substract scroll distance
		else if (newScroll < (window.oldScroll || 0)) scrollDistance -= (window.oldScroll || 0) - newScroll;

		window.oldScroll = window.scrollY;
		if (scrollDistance >= scrollLimit) showModal();
	};

	window.addEventListener("scroll", handleScroll);

	const showModal = () => {
		if (modalDisplayed) return;

		modalDisplayed = true;

		const modal = document.createElement("div");
		modal.id = "scroll-modal";
		const imageId = Math.min(warnings, maxImageLevel);
		const imageOriginalUrl = `assets/${imageId}.jpg`;
		const imageUrl = chrome.runtime ? chrome.runtime.getURL(imageOriginalUrl) : imageOriginalUrl;
		const windowsScrolled = Math.round(scrollDistance / window.innerHeight);
		const warningCount = warnings + 1;
		modal.innerHTML = htmlTemplate
			.replace("{{imageUrl}}", imageUrl)
			.replace("{{windowsScrolled}}", windowsScrolled)
			.replace("{{warningCount}}", warningCount);
		document.body.appendChild(modal);

		document.getElementById("scrollcatcher-dismiss-button").onclick = () => {
			modal.remove();
			modalDisplayed = false;
			scrollLimit += initialScrollLimit;
			scrollDistance = 0;
			warnings += 1;
		};

		document.getElementById("scrollcatcher-abort-button").onclick = () => {
			window.removeEventListener("scroll", handleScroll);
			modal.remove();
		};
	};
};
init();

// Template for modal
const htmlTemplate = `
<div
	id="scroll-modal"
	style="
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		overflow: hidden;
	"
>
	<div
		class="modal-content"
		style="
			background: white;
			padding: 20px;
			border-radius: 14px;
			text-align: center;
			color: black;
			display: flex;
			flex-direction: column;
			align-items: center;
		"
	>
		<div
			class="modal-content-wrapper"
			style="display: flex; flex-direction: column; align-items: center; max-width: 600px"
		>
			<h2
				style="color: black; font-family: arial; font-weight: 800; margin: 0; margin-top: 0.2rem; margin-bottom: 1rem"
			>
				Scrolling a lot!
			</h2>
			<p style="color: black; font-family: arial; font-weight: 600; margin: 0; margin-bottom: 1rem">
				This is the warning number {{warningCount}}. <br />
				You've scrolled around {{windowsScrolled}} full height windows.
			</p>
			<img src="{{imageUrl}}" alt="Cat image" style="margin-bottom: 20px; width: 100%; border-radius: 14px" />
			<div style="display: flex">
				<button
					id="scrollcatcher-dismiss-button"
					style="
						margin-top: 20px;
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
						text-align: center;
						transition-duration: 0.15s;
						transition-property: all;
						transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
						:hover {
							background: rgb(251, 193, 245);
						}
					"
				>
					Dismiss. <br/>I want to waste even more time scrolling.
				</button>
				<button
					id="scrollcatcher-abort-button"
					style="
						margin-top: 20px;
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
						text-align: center;
						transition-duration: 0.15s;
						transition-property: all;
						transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
						:hover {
							color: #000;
							background: rgb(255, 218, 87);
						}
					"
				>
					Don't bother me. <br/> I'm actually doing something productive or I just don't care. 
				</button>
			</div>
		</div>
	</div>
</div>
<style>
</style>
`;
