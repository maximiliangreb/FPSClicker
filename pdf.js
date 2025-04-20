//consts
const MILLION = 1000000
const BILLION = 1000000000
const INCREMENT_UPGRADE = 1.15;

//Clicker Reference
const clicker = document.getElementById('clicker');

//Money and FPS showers
const cpsShower = document.getElementById("cps")
const money = document.getElementById('money');
const fpsShower = document.getElementById('fps');

//Save-System References
const body = document.getElementById("body");
const saveMenu = document.getElementById("save-container");
let saveMenuOpen = false;

//Currencies
let clicks = 0;
let fps = 0;
let cps = 1;

//Chances
let doubleClickChance = 0;
let fiveClickChance = 0; //Kp was das fünffache auf englisch heißt

//Jonis Kleine Käsemauken
let updatedClicks = "";


//Upgrade-Arrays
let upgrades = [];
let gridUpgrades = [];



//Class for Side-Upgrades
class UpgradeCPUGPU {
    constructor(name, price, value, element, type) {
        this.name = name;
        this.price = parseInt(price);
        this.showPrice = Converter(price);
        this.value = parseFloat(value);
        this.type = type;
        this.element = element;
        this.bought = false;
    }
    UpdateShowPrice(){
        //Updates the showPrice
        this.showPrice = Converter(this.price);
    }
}

//Class for Grid-Upgrades
class GridUpgrade {
    constructor (name, price, element, type){
        this.name = name;
        this.price = parseInt(price);
        this.element = element;
        this.type = type;
    }
    UpdateShowPrice(){
        //Updates the showPrice
        this.showPrice = Converter(this.price);
    }
}

//Handles Clicker-Logic
clicker.addEventListener('click', function() {
    // Generate random numbers for double click chance

    //Zeit-/Raumkomplexität besser so
    let randomNumberDouble1, randomNumberDouble2, randomNumberFive1, randomNumberFive2;
    if (doubleClickChance > 0 || fiveClickChance > 0) {
        if (doubleClickChance > 0) {
            let maxRangeDouble = Math.max(1, 1 / doubleClickChance); 
            randomNumberDouble1 = Math.floor(Math.random() * maxRangeDouble);
            randomNumberDouble2 = Math.floor(Math.random() * maxRangeDouble);
        }

        // Generate random numbers for five click chance
        if (fiveClickChance > 0) {
            let maxRangeFive = Math.max(1, 1 / fiveClickChance); 
            randomNumberFive1 = Math.floor(Math.random() * maxRangeFive);
            randomNumberFive2 = Math.floor(Math.random() * maxRangeFive);
        }
    }

    // Check for double click
    if (doubleClickChance > 0 && (randomNumberDouble1 === randomNumberDouble2 || doubleClickChance === 1)) {
        clicks += cps;
    }

    // Check for five click
    if (fiveClickChance > 0 && (randomNumberFive1 === randomNumberFive2)) {
        clicks += cps * 4;
    }

    // Add regular clicks
    clicks += cps;

    // Refresh the display
    RefreshText();
});


//Gets every Side-Upgrade-Element
Array.from(document.getElementsByClassName("cpu-row-content")).forEach(element => {
    // Gets every Upgrade and gives them the Upgrade class and adds them to the upgrades array
    const price = element.getAttribute("data-price");
    const value = element.getAttribute("data-value");
    const name = element.getAttribute("data-name");
    const type = element.getAttribute("id");

    //Gives the Upgrade GridUpgrade() class
    //Gives the Upgrade to upgrade Array
    upgrades.push(new UpgradeCPUGPU(name, price, value, element, type));

    //Calls UpgradeBuySide onClick
    element.addEventListener('click', function() {
        UpgradeBuySide(name);
    });
});

//Gets every Grid-Upgrade-Element
Array.from(document.getElementsByClassName("grid-upgrade")).forEach(element => {
    const price = element.getAttribute("data-price");
    const name = element.getAttribute("data-name");
    const type = element.getAttribute("id");

    //Gives the Upgrade GridUpgrade() class
    const gridUpgrade = new GridUpgrade(name, price, element, type);

    //Gives the Upgrade to upgrade Array
    gridUpgrades.push(gridUpgrade);
    
    //Calls UpgradeBuyGrid onClick
    element.addEventListener('click', function() {
        UpgradeBuyGrid(gridUpgrade);
    });
    element.bought = false;
});

//Handles Upgrade Buy Logic
function UpgradeBuySide(upgradeName) {
    //Finds Upgrade in upgrades-Array
    const upgrade = upgrades.find(upg => upg.name === upgradeName);

    //Checks if you can afford the Upgrade
    if (upgrade && clicks >= upgrade.price) {
        //Upgrade-Buy-Logic
        clicks -= upgrade.price;
        if (upgrade.type == "cpu"){
            fps += upgrade.value;
        }else{
            cps += upgrade.value;
        }
        upgrade.price *= INCREMENT_UPGRADE;
        upgrade.price = Math.round(upgrade.price);
        upgrade.UpdateShowPrice();
        RefreshText();
        RefreshUpgradeText(); 
    }    
}


function UpgradeBuyGrid(upgrade) {
    //Check if you can afford the Upgrade
    if (clicks >= upgrade.price) {
        //Self explanatory :|
        clicks -= upgrade.price;
        switch (upgrade.name) {
            //Different Upgrade-Cases
            case "8":
            case "1": 
                upgrades.forEach(upgrade => {
                    if (upgrade.type == "cpu") {
                        upgrade.value = upgrade.value * 2;
                        upgrade.value = Math.round(upgrade.value);
                        RefreshUpgradeText();
                    }
                });
                fps *= 2;
                break;
            case "9":
            case "2": 
                upgrades.forEach(upgrade => {
                    if (upgrade.type == "gpu") {
                        upgrade.value = upgrade.value * 2;
                        if (!upgrade.value == 0.2){
                            upgrade.value = Math.round(upgrade.value);
                        }
                        RefreshUpgradeText();
                    }
                });
                cps *= 2;
                break;
            case "12":
            case "3":
                upgrades.forEach(upgrade => {
                    if (upgrade.type == "cpu") {
                        upgrade.price = upgrade.price / 2;
                        upgrade.price = Math.round(upgrade.price);
                        upgrade.UpdateShowPrice();
                        RefreshUpgradeText();
                    }
                });
                break;
            case "13":
            case "4":
                upgrades.forEach(upgrade => {
                    if (upgrade.type == "gpu"){
                        upgrade.price = upgrade.price / 2;
                        upgrade.price = Math.round(upgrade.price);
                        upgrade.UpdateShowPrice();
                        RefreshUpgradeText();
                    }
                });
                break;
            case "15":
            case "5":
                clicks *= 2;
                break;
            case "6":
                doubleClickChance += 0.2;
                break;
            case "7":
                doubleClickChance += 0.5;
                break;
            case "10":
                doubleClickChance = 1;
                break;
            case "11":
                fiveClickChance += 0.1;
                break;
            case "14":
                fiveClickChance = 1;
                break;
        }
        RefreshText();
        upgrade.element.remove();
        upgrade.bought = true;
    }
}



function GrayOutUpgrade() {
    //Grays out upgrades that you cant afford

    //Side-Upgrades
    upgrades.forEach(upgrade => {
        if (clicks < upgrade.price) {
            Invisible(upgrade.element);
        } else {
            upgrade.element.style.opacity = 1;
        }
    });
    //Grid-Upgrades
    gridUpgrades.forEach(upgrade => {
        if (clicks < upgrade.price) {
            Invisible(upgrade.element);
        } else {
            upgrade.element.style.opacity = 1;
        }
    });
}

function RefreshText() {
    //Refreshes Money & FPS shower
    cpsShower.textContent = "CPS: " + cps.toFixed(1);
    money.textContent = "Geld: " + Converter(clicks);
    fpsShower.textContent = "FPS: " + fps;
}

function Invisible(object){
    // Makes 'this' opacity 0.5
    object.style.opacity = 0.5;
}


function AddCPSToMoney() {
    //Adds  1/100 of the FPS to the clicks (is called every 1/100 of a second)
    clicks += fps / 100;
    RefreshText();
}

function Converter(number){
    //Returns a number to a string with M or B (1,000,000 return = "1M")
    let newNumber;

    //Convert to Int
    newNumber = parseInt(number);

    //M
    if (number >= MILLION && number < 999999999){
        newNumber = `${(number / 1000000).toFixed(2)}M`
    }
    //B
    else if(number >= BILLION && number < 999999999999){
        newNumber = `${(number / 1000000000).toFixed(2)}B`
    }

    return newNumber;
}

function RefreshUpgradeText(){
    //Refreshes the text of every Side-Upgrade

    upgrades.forEach(upgrade =>{
        //Case CPU
        if (upgrade.type == "cpu"){
            upgrade.element.innerHTML = `
            <p>
                <b>${upgrade.showPrice} Money</b> <br>
                +${upgrade.value} FPS
            </p>
            <p class="cpu-upgrade-name">
                <b>${upgrade.name}</b>
            </p>
            `;
        }
        //Case GPU
        else{
            upgrade.element.innerHTML = `
            <p>
                <b>${upgrade.showPrice} Money</b> <br>
                +${upgrade.value} CPS
            </p>
            <p class="cpu-upgrade-name">
                <b>${upgrade.name}</b>
            </p>
            `;
        } 
    });
}

// Calls AddCPSToMoney() every 10 Milliseconds
setInterval(AddCPSToMoney, 10);

// Calls GrayOutUpgrade() every 100 Milliseconds
setInterval(GrayOutUpgrade, 100);

function Open_Close_Save_Menu() {
    if (saveMenuOpen) {
        saveMenuOpen = false;
        body.style.opacity = 1;
        saveMenu.innerHTML = "";
        saveMenu.style.opacity = 0;
    } else {
        saveMenuOpen = true;
        body.style.opacity = 0.6;
        saveMenu.innerHTML = `
            <h3>TUTORIAL</h3>
            <p class="tutorial-text">If you want to save the game, press the save button and copy the code.</p>
            <p class="tutorial-text">If you want to load the game, put the saved code in the input and press the load button.</p>
            <button onClick="saveGame()">Save</button>
            <input id="save-shower" placeholder="(Press save button)" readonly>
            <input type="text" id="save-input">
            <button onClick="decryptCode()">Load</button>
        `;
        saveMenu.style.opacity = 1;
    }
}



//------------------------------------------Save-System------------------------------------------------



//Generates a new Secret-Number (new seed) every time the page is reloaded => makes the save code unique every save and makes it harder to cheat without knowing the js code
let SECRET_NUMBER_SAVE_SYSTEM = Math.floor(Math.random() * 1000);

function saveGame() {
    // Saves the game

    //Reference
    const saveShower = document.getElementById("save-shower");

    // Array for the encrypted code
    let saveCode = [];

    // Normal Variables:

    //Encrypts the clicks, cps, fps, doubleClickChance and fiveClickChance, by dividing them by the Secret-Number and adding it to 7, and adds them to the saveCode
    saveCode.push(clicks / SECRET_NUMBER_SAVE_SYSTEM + 7);
    saveCode.push(cps / SECRET_NUMBER_SAVE_SYSTEM + 7);
    saveCode.push(fps / SECRET_NUMBER_SAVE_SYSTEM + 7);
    saveCode.push(doubleClickChance / SECRET_NUMBER_SAVE_SYSTEM + 7);
    saveCode.push(fiveClickChance / SECRET_NUMBER_SAVE_SYSTEM + 7);

    // Side-Upgrades:

    //Encrypts the price and value of every upgrade (same system as before (l. 361)) and adds them to the saveCode
    upgrades.forEach(upgrade => {
        saveCode.push(upgrade.price / SECRET_NUMBER_SAVE_SYSTEM + 7);
        saveCode.push(upgrade.value / SECRET_NUMBER_SAVE_SYSTEM + 7);
    });

    
    //Seperates the Side-Upgrades from the Grid-Upgrades in the encrypted Array
    saveCode.push("I");

    //Encrypts the Grid-Upgrades and adds them to the saveCode
    gridUpgrades.forEach(upgrade => {
        if (upgrade.bought) {
            saveCode.push("1");
        } else {
            saveCode.push("0");
        }
    });

    //Seperates the Grid-Upgrades from the Secret-Number in the encrypted Array
    saveCode.push("I");
    
    //Stores the Secret-Number at the end of saveCode
    saveCode.push(SECRET_NUMBER_SAVE_SYSTEM);

    // Shows the encrypted code
    saveShower.value = saveCode.join(";");
}

function decryptCode() {
    // Decrypts the encrypted code

    //reference
    const saveInput = document.getElementById("save-input");

    if (!saveInput.value || !saveInput.value.includes("I")) {
        alert("Invalid save code. Please enter a valid code.");
        return;
    }

    // Splits the input into the Side-Upgrades and the Grid-Upgrades
    const sideAndGridDifferentiator = saveInput.value.split("I");
    const saveCodeSide = sideAndGridDifferentiator[0].split(";");
    const saveCodeGrid = sideAndGridDifferentiator[1].split(";");

    // Gets the Secret-Number from the old save
    SECRET_NUMBER_SAVE_SYSTEM = sideAndGridDifferentiator[2].split(";")[1];

    let decryptedCode = [];

    // Push Currencies & Side-Upgrades to decryptedCode
    for (let i = 0; i < 5; i++) {
        decryptedCode.push(Math.round((parseFloat(saveCodeSide[i]) - 7) * SECRET_NUMBER_SAVE_SYSTEM));
    }
    

    // Encrypts Side-Upgrades and pushes them to decryptedCode
    for (let i = 0; i < upgrades.length; i++) {
        decryptedCode.push(Math.ceil((saveCodeSide[i * 2 + 5] - 7) * SECRET_NUMBER_SAVE_SYSTEM));
        decryptedCode.push(Math.ceil((saveCodeSide[i * 2 + 6] - 7) * SECRET_NUMBER_SAVE_SYSTEM));
        upgrades[i].price = decryptedCode[i * 2 + 5];
        upgrades[i].value = decryptedCode[i * 2 + 6];
        upgrades[i].UpdateShowPrice();
        RefreshUpgradeText();
    }

    //Update Grid-Upgrades
    gridUpgrades.forEach(upgrade => {
        if (saveCodeGrid[upgrade.name] === "1") {
            upgrade.bought = true;
            upgrade.element.remove();
        }
    });

    // Update currencies
    clicks = decryptedCode[0];
    cps = decryptedCode[1];
    fps = decryptedCode[2];
    doubleClickChance = decryptedCode[3];
    fiveClickChance = decryptedCode[4];
}

//let Psychiosen-Counter = 5.75