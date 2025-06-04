
const baseURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/";
const dropdowns = document.querySelectorAll(".currency_dropdown select");

let convertButton = document.querySelector("#convert_button");
let resetButton = document.querySelector("#reset_button");

let errorMessage = document.querySelector("#amount_error");

let result = document.querySelector("#result");



let index = 0;
errorMessage.style.display = "none";

for (let select of dropdowns) {
    for (let currencyCode in countryList) {
        let newOption = document.createElement("option");
        newOption.value = currencyCode;
        newOption.innerText = currencyCode;
        if (select.name === "from_currency" && currencyCode === "BDT") {
            newOption.selected = "selected";
        } else if (select.name === "to_currency" && currencyCode === "BDT") {
            newOption.selected = "selected";
        }
        select.appendChild(newOption);
    }

    select.addEventListener("change", (e) =>{
            updateCountryFlag(e.target);
    });
}

const updateCountryFlag = (element) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let newSourceLink = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let imgElement = element.parentElement.querySelector("img");
    imgElement.src = newSourceLink;
}

convertButton.addEventListener("click", async (e) =>{
    e.preventDefault();
    let amountInput = document.querySelector("#amount");
    if (amountInput.value === "") {
        amountInput.reportValidity();
        return;
    }else if(amountInput.value <= 0){
        errorMessage.style.display = "block";
        errorMessage.textContent = "Please enter a valid amount!";
        errorMessage.style.color = "red";
        amountInput.value = "";
        amountInput.reportValidity();
        return;
    }
    errorMessage.style.display = "none";
    let fromCurrency = document.querySelector("#from_currency").value.toLowerCase();
    let toCurrency = document.querySelector("#to_currency").value.toLowerCase();

    let amount = parseFloat(amountInput.value);
    try {
        const response = await fetch(`${baseURL}currencies/${fromCurrency}.json`);
        if (!response.ok) throw new Error("Failed to fetch rates");
        const data = await response.json();
        const rate = data[fromCurrency][toCurrency];
        if (!rate) {
            result.value = "Rate not found!";
            return;
        }
        result.value = (amount * rate).toFixed(2);
        result.focus();
    } catch (err) {
        result.value = "Conversion error!";
        console.error(err);
    }

})

resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#amount").value = "";
    result.value = "";
    errorMessage.style.display = "none";
    for (let select of dropdowns) {
        select.value = "BDT";
        updateCountryFlag(select);
    }
});


