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

const form = document.querySelector("form");
const unit = document.querySelector("#unit");
const amount = document.querySelector("#amount");
const domains = document.querySelector("#domains");
const button = document.querySelector("#save-button");

const init = () => {
	chrome.storage.local.get(["unit", "amount", "domains"], (result) => {
		unit.value = result.unit || defaultUnit;
		amount.value = result.amount || defaultAmount;
		domains.value = result.domains || defaultWhitelistedDomains.join(", ");
	});
};
init();

form.addEventListener("change", () => {
	button.textContent = "Save";
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
	chrome.storage.local.set({
		unit: unit.value,
		amount: amount.value,
		domains: domains.value,
	});
	button.textContent = "Saved!";
});
