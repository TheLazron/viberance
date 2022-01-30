//global selections and variables
const baseColorDiv = document.querySelector(".colors");
let colorDivs = document.querySelectorAll(".color");
const generateBTn = document.querySelector(".generate");
const sliders = document.querySelectorAll(`input[type = "range"]`);
const colorHexes = document.querySelectorAll(".color h2");
let initialColors;
let savedPalettes;
let tempInitialColors
const adjustmentBtns =document.querySelectorAll(".adjust");
const copyContainer  = document.querySelector(".copy-container");
const closeBtns = document.querySelectorAll(".close-adjustment");
const generateBtn = document.querySelector(".generate");
const lockBtns = document.querySelectorAll(".lock");

savedPalettes = [];
//Adding Event Listeners

generateBTn.addEventListener("click", randomColors);
document.addEventListener("keypress", (e)=>{
    if(e.code==="Space"){
        randomColors();
    }
})

lockBtns.forEach(function(btn, index){
    btn.addEventListener("click", ()=>{
        lockFunctionality(index);
    })
});


function lockFunctionality(index){
    const activeDiv = colorDivs[index];
    activeDiv.classList.toggle("locked");
    
    lockBtns[index].children;
    
    // lockBtns[index].children[0].classList.toggle("fa-lock-open");
    // const lockIcon = 
    lockBtns[index].children[0].classList.toggle("fa-lock-open");
    lockBtns[index].children[0].classList.toggle("fa-lock");
    
    console.log(lockBtns[index].children[0].classList);
    
    
}


closeBtns.forEach((closeBtn, index)=>{
    closeBtn.addEventListener("click", ()=>{
        closeSliders(index);
    });
   
});



adjustmentBtns.forEach((adjbtn,index) =>{
    adjbtn.addEventListener("click", ()=>{
      
        toggleSliders(adjbtn,index);
    });
})
sliders.forEach(function(slider){
    
    slider.addEventListener("input", hslControls);
    
})

colorDivs.forEach(function(div, index){
    div.addEventListener('change', ()=>{
        console.log(div);
        updateTextUI(index);
    })
})

colorHexes.forEach(function(hex){
    hex.addEventListener("click", function(){
        copyToClipboard(hex.innerText);
    })
})

copyContainer.addEventListener("transitionend", ()=>{
    const copyPopup = copyContainer.children[0];
    copyContainer.classList.remove("active");
    copyPopup.classList.remove("active");
})
//functions


function generateHex(){//generate and return a random hexCode
    // let letters = "0123456789ABCDEF";1
    // let hash = "#";

    // for(i=0;i<6;i++){
    //     hash+= letters[Math.floor(Math.random()*16)];
    // }
   let hexCode = chroma.random();
    
    return hexCode;
 }


 function randomColors(){//loop over all the divs and assign them with a random bgColor, color of HexText and initial color of sliders with the help of a function
    initialColors=[];

    colorDivs.forEach(function(div, index){
        const icons = div.querySelectorAll(".controls button");
        let randomGeneratedColor = generateHex();
        let divText = div.childNodes[1];
        if(div.classList.contains("locked")){
            initialColors.push(initialColors[index]);
            return;
        }
        else{}
        initialColors.push(chroma(randomGeneratedColor).hex());
        div.style.backgroundColor = randomGeneratedColor;
        divText.innerHTML = randomGeneratedColor;
   

        
       checkTextContrast(randomGeneratedColor, divText);
       for(icon of icons){
        checkTextContrast(randomGeneratedColor, icon);
    }
        
       let color = chroma(randomGeneratedColor);
       const sliders = div.querySelectorAll(".sliders input");
       const hue = sliders[0];
       const brightness = sliders[1];
       const saturation = sliders[2];
       
       colorizeSliders(color, hue, brightness, saturation);

       //resting coloized sliders
        resetSliders(hue, brightness, saturation);
    })
}

function colorizeSliders(color, hue, brightness, saturation){//colorize the sliders of the div it was called for
    //Saturation Scale
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);

    //brightness Scale
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale([`black`, midBright, `white`]);

   //Setting slider's backgroundColor
   
   saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
   brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
   hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`; //hue is just a rainbow
}


function resetSliders(hue, brightness, saturation){
    const hueColor = initialColors[hue.getAttribute("data-hue")];
    const hueValue = chroma(hueColor).hsl()[0];
    
    hue.value = Math.floor(hueValue);


    const saturationColor = initialColors[saturation.getAttribute("data-sat")];
    const saturationValue = chroma(saturationColor).hsl()[1];
    
    saturation.value = saturationValue.toFixed(1);
    


    const brightnessColor = initialColors[brightness.getAttribute("data-brightness")];
    const brightnessValue = chroma(brightnessColor).hsl()[2];

    brightness.value = brightnessValue.toFixed(3);

   
}

function hslControls(e){
    const index = e.target.getAttribute("data-hue")||e.target.getAttribute("data-brightness")||e.target.getAttribute("data-sat");
    let sliders = e.target.parentElement.querySelectorAll(`input[type = "range"]`);//selecting all the  input sliders of that colorDiv
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    
    const bgColor = initialColors[index];
    console.log(initialColors);
    let color = chroma(bgColor).set("hsl.s", saturation.value).set("hsl.h", hue.value).set("hsl.l", brightness.value)
    // console.log(bgColor);

    colorDivs[index].style.backgroundColor = color;
   
    colorizeSliders(color, hue, brightness, saturation);
    
}

function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const hexText = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    hexText.innerHTML = color.hex();
    checkTextContrast(color, hexText);
   
    for(icon of icons){
        checkTextContrast(color, icon);
    }

}


 function checkTextContrast(color, text){

    let colorLuminance = chroma(color).luminance();
    if(colorLuminance>0.5){
        text.style.color = "black";
    }
    else{
        text.style.color = "white";
    }
    
    
 }

function copyToClipboard(hex){
    const el = document.createElement("textarea");
    el.value = hex;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    const copyPopup = copyContainer.children[0];
    copyContainer.classList.add("active");
    copyPopup.classList.add("active");
}


function toggleSliders(adjbtn,index){
    // const index = adjbtn.parentElement.parentElement.children[2].children[2].getAttribute("data-hue");
    const activeDiv = colorDivs[index];
  
    activeDiv.children[2].classList.toggle("active");
 

}

function closeSliders(index){
    const activeDiv = colorDivs[index];
   
    activeDiv.children[2].classList.remove("active");
}


//Implement Save to palette and LOCAL STORAGE STUFF

const saveBtn =  document.querySelector(".save");
const submitSave =  document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");
const libraryContainer = document.querySelector(".library-container");
const libraryPopup = document.querySelector(".library-popup");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

//Adding Event listeners

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);


function openPalette(e){
    const savePopup = saveContainer.children[0];
    saveContainer.classList.add("active");
    savePopup.classList.add("active");
    console.log(saveBtn);
}

function closePalette(e){
    const savePopup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
}

function savePalette(e){
    const savePopup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
    const name = saveInput.value;
    const colors=[];
    colorHexes.forEach(hex=>{
        colors.push(hex.innerText);
    })

    let paletteNr = savedPalettes.length;
    const paletteObject = {
        name: name,
        colors: colors,
        nr: paletteNr
    };
    savedPalettes.push(paletteObject);
    
    savetoLocal(paletteObject);
    saveInput.value = "";
    //Generate the palette for Library 
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObject.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObject.colors.forEach((smallColor)=>{
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObject.nr);
    paletteBtn.innerText = "Select";
    paletteBtn.addEventListener("click", (e)=>{
        selectSavedPalette(e.target);
        closeLibrary();
    });
    
//Appneding to Library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryPopup.appendChild(palette);


}


function selectSavedPalette(paletteObject, selecBtn){
    
    const paletteNr = selecBtn.classList[1];
    selectedPalette = paletteObject.colors;
    initialColors=[];
    colorDivs.forEach((div, index)=>{
        div.style.backgroundColor = selectedPalette[index];
        initialColors.push(selectedPalette[index]);
        const text = div.children[0];
        updateTextUI(index);
        checkTextContrast(selectedPalette[index], text);
        const sliders  = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const bright = sliders[1];
        const sat = sliders[2];
        const color = chroma(initialColors[index]);
        colorizeSliders(color, hue, bright, sat)
       resetSliders(hue, bright, sat);
    });

    
    // libraryInputUpdate();


}



function openLibrary(){
    libraryContainer.classList.add("active");
    libraryPopup.classList.add("active");
}
function closeLibrary(){
    libraryContainer.classList.remove("active");
    libraryPopup.classList.remove("active");
}
 
function savetoLocal(paletteObj){
    let localPalettes;
    if(localStorage.getItem("palettes")===null){
        localPalettes=[];
    }
    else{
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getLocal(){
    if(localStorage.getItem("palettes") === null){
        localStorage = [];
    }
    else{
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        paletteObjects.forEach(paletteObject =>{
                //Generate the palette for Library 
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObject.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObject.colors.forEach((smallColor)=>{
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObject.nr);
    paletteBtn.innerText = "Select";
    paletteBtn.addEventListener("click", (e)=>{
        selectSavedPalette(paletteObject, e.target);
        closeLibrary();
    });
    
//Appneding to Library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryPopup.appendChild(palette);


        });
    } 
}


////////////////////////////MY CODE///////////////////////////////




function addNewColorDiv(){
//creating Div using javaSript
const colorDiv = document.createElement("div");
colorDiv.classList.add("color");
const hexText = document.createElement("h2");
hexText.innerText = "hex";
colorDiv.appendChild(hexText);
const controlsDiv = document.createElement("div");
controlsDiv.classList.add("controls");
colorDiv.appendChild(controlsDiv);
const adjustButton = document.createElement("button");
adjustButton.classList.add("adjust");
const adjustITag = document.createElement("i");
adjustITag.classList.add("fas");
adjustITag.classList.add("fa-slider-h");
adjustButton.appendChild(adjustITag);

const lockButton = document.createElement("button");
lockButton.classList.add("lock");
const lockITag = document.createElement("i");
lockITag.classList.add("fas");
lockITag.classList.add("fa-lock-open");
lockButton.appendChild(lockITag);
controlsDiv.appendChild(adjustButton);
controlsDiv.appendChild(lockButton);

const sliderDiv = document.createElement("div");
sliderDiv.classList.add("sliders");
const closeSlidersButton =  document.createElement("button");
closeSlidersButton.classList.add("close-adjustment");
closeSlidersButton.innerText = "X";
sliderDiv.appendChild(closeSlidersButton);

//hueSlider
const hueSpan = document.createElement("span");
hueSpan.innerText = "Hue";
const hueSlider = document.createElement("input");
hueSlider.type = "slider";
hueSlider.min =0;
hueSlider.max = 360;
hueSlider.step = 1;
hueSlider.name = "hue";
hueSlider.classList.add("hue-input");
hueSlider.setAttribute("data-hue",colorDivs.length);


sliderDiv.appendChild(hueSpan);
sliderDiv.appendChild(hueSlider);
//brightnessSlider
const brightSpan = document.createElement("span");
brightSpan.innerText = "Brightness";
const brightSlider = document.createElement("input");
brightSlider.type = "slider";
brightSlider.inputMode= "slider";
brightSlider.min =0;
brightSlider.max = 1;
brightSlider.step = 0.01;
brightSlider.name = "brightness";
brightSlider.classList.add("brightness-input");
brightSlider.setAttribute("data-brightness",colorDivs.length);

sliderDiv.appendChild(brightSpan);
sliderDiv.appendChild(brightSlider);
//saturationSlider
const satSpan = document.createElement("span");
satSpan.innerText = "Saturation";
const satSlider = document.createElement("input");
satSlider.type = "slider";
satSlider.min =0;
satSlider.max = 1;
satSlider.step = 0.01;
satSlider.name = "saturation";
satSlider.classList.add("sat-input");
satSlider.setAttribute("data-sat",colorDivs.length);

sliderDiv.appendChild(satSpan);
sliderDiv.appendChild(satSlider);

colorDiv.appendChild(sliderDiv);

baseColorDiv.appendChild(colorDiv);

colorDivs = document.querySelectorAll(".color");
//all the color divs including the new one are selected
tempInitialColors = [...initialColors];
//tempInitialColors is empty and then set to initial Colors that includes the new div as well.
randomColors();     
console.log(initialColors);
tempInitialColors.push(initialColors[colorDivs.length-1]);

initialColors = tempInitialColors;
// tempInitialColors.push(initialColors[initialColors.length]);
// console.log(initialColors);
// initialColors=[];
console.log(tempInitialColors);
console.log(initialColors);




    colorDivs.forEach((div, index)=>{
        div.style.backgroundColor =initialColors[index];        const text = div.children[0];
        updateTextUI(index);
        checkTextContrast(initialColors[index], text);
        const sliders  = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const bright = sliders[1];
        const sat = sliders[2];
        const color = chroma(initialColors[index]);
        colorizeSliders(color, hue, bright, sat)
       resetSliders(hue, bright, sat);

})

//  console.log("after adding div:"+tempInitialColors.length);
tempInitialColors=[];


}

const addNewColorBtn = document.querySelector(".addNewColor");
    console.log(addNewColorBtn);
addNewColorBtn.addEventListener("click",function(e){
    addNewColorDiv();
    // console.log(initialColors);
})


getLocal();
randomColors(); 