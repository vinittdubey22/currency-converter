const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("#btn");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector("#swap-icon");

// Populate dropdowns
for (let select of dropdowns) {
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

// Flag update
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Convert button click
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtValue = amount.value;

  if (amtValue === "" || amtValue < 1) {
    amtValue = 1;
    amount.value = "1";
  }

  msg.innerText = "Loading...";

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalValue = (amtValue * rate).toFixed(2); 

    msg.innerText = `${amtValue} ${fromCurr.value} = ${finalValue} ${toCurr.value}`;
    msg.classList.add("flash");
    setTimeout(() => msg.classList.remove("flash"), 300);
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
  }
});

// Swap button click
swapBtn.addEventListener("click", () => {
  // Swap values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);
});
