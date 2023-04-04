const slider = document.getElementById('slider');
const lengthDisplay = document.getElementById('data-length');
const pwdDisplay = document.getElementById('display');
const copyBtn = document.getElementById('copy-btn');
const copyMsg = document.getElementById('copy-msg');
const upper = document.getElementById("uppercase")
const lower = document.getElementById("lowercase")
const number = document.getElementById("numbers")
const symbol = document.getElementById("symbols")
const indicator = document.querySelector('[data-indicator]')
const generateBTN = document.getElementById('generate-btn');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbolString = "!~#$%^&*+-/?|<>_=:;";
handleSlider();

function handleSlider(){
    slider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = slider.min
    const max = slider.max;
    slider.style.backgroundSize = ((passwordLength - min)*100 /(max-min)) + "% 100%"
}


// set Indicator color 
function setIndicator(color){
    // indicator.style.cssText = color;
    indicator.style.cssText = (`background-color: ${color}; box-shadow: 0px 0px 12px ${color};`)
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function getUppercaseLetter(){
    return String.fromCharCode(getRndInteger(65,90));
}

function getLowercaseLetter(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getSymbol(){
    const index = getRndInteger(0, symbolString.length);
    return symbolString.charAt(index);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upper.checked) hasUpper = true;
    if(lower.checked) hasLower = true;
    if(number.checked) hasNumber = true;
    if(symbol.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator('#ec1429');
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator('#14ec2d');
    }
    else{
        setIndicator('#d3ff43');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }
    // console.log("add active class")
    copyMsg.classList.add('active');
    // copyMsg.style.scale = 1;
    setTimeout(() => {
        copyMsg.classList.remove('active');
        console.log("remove active class")
        copyMsg.innerText = '';
        // copyMsg.style.scale = 0;
    },2000);
}

function sufflePassword(array){
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = ""
    array.forEach( (el) => {
        str += el;
    })
    return str;
}

slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=> {
    // console.log("press copy button")
    if(pwdDisplay.value)   // if(password.length != 0)
        copyContent();
})
function handleCheckbox(){
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox)=> {
    checkBox.addEventListener('change', handleCheckbox);
})


generateBTN.addEventListener('click', ()=> {
    console.log("btn");
    if(checkCount <= 0) {
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = '';
    let funArray = [];

    if(upper.checked){
        funArray.push(getUppercaseLetter);
    }
    if(lower.checked){
        funArray.push(getLowercaseLetter);
    }
    if(number.checked){
        funArray.push(generateRandomNumber);
    }
    if(symbol.checked){
        funArray.push(getSymbol);
    }

    for(let i=0; i<funArray.length; i++){
        password += funArray[i]();
        console.log(password);
    }

    for(let i=0; i<passwordLength-funArray.length; i++){
        let randomIndx = getRndInteger(0,funArray.length);
        console.log('randomIndx'+randomIndx);
        password += funArray[randomIndx]();
    }

    password = sufflePassword(Array.from(password));

    pwdDisplay.value = password;
    calculateStrength();
})