const apiKey = "c582a92df7836785382527563eafd3ec"; // Fixer.io API key
const baseUrl = `https://data.fixer.io/api/latest?access_key=${apiKey}`;

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdown) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        // Fetching exchange rates from Fixer.io
        let response = await fetch(baseUrl);
        let data = await response.json();

        if (data.success) {
            // Get the exchange rates for the selected currencies
            let fromRate = data.rates[fromCurr.value];
            let toRate = data.rates[toCurr.value];

            // Convert the amount from "fromCurr" to "toCurr"
            let finalAmount = (amtVal / fromRate) * toRate;

            // Display the conversion result
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
        } else {
            msg.innerText = "Error fetching exchange rates.";
        }
    } catch (error) {
        msg.innerText = "An error occurred while fetching data.";
        console.error(error);
    }
});
