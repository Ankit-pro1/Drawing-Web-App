let canva = document.querySelector('canvas'),
    ctx = canva.getContext('2d'),
    toolBtns = document.querySelectorAll('.tools'),
    fillColor = document.querySelector('#fill-color'),
    rangeSlider = document.querySelector('#range-slider'),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanva = document.querySelector(".clear-btn"),
    saveImg = document.querySelector('.save-img');


let prevMouseX, prevMouseY, snapshot,
    isDraw = false,
    selectedTool = "brush",
    brushWidth = 5,
    brushColor = "#000";

const setCanvaBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canva.width, canva.height);
    ctx.fillStyle = brushColor;
}

window.addEventListener('load', () => {
    canva.width = canva.offsetWidth;
    canva.height = canva.offsetHeight;
    setCanvaBackground ();
})

toolBtns.forEach((btn) => {
    btn.addEventListener('click', () => {

        document.querySelector('.options .active').classList.remove('active');  // Removing the previous active class
        btn.classList.add('active');  // Adding the active class on clicked element
        selectedTool = btn.id;
        // console.log(selectedTool);

    })
})

// Draw triangle
const drawTriangle = (e) => {
    ctx.beginPath(); //creates a new path to the triangle
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo((prevMouseX * 2 - e.offsetX), e.offsetY);
    ctx.closePath(); //It close the triangle
    fillColor.checked ? ctx.fill() : ctx.stroke(); //If fillColor checkbox is checked then draw filled triangle otherwise draw stroke triangle
}




// Draw Circle
const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

// Draw Rectangle
const drawRect = (e) => {
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}

// Draw Line
const startDraw = (e) => {
    isDraw = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    snapshot = ctx.getImageData(0, 0, canva.width, canva.height);
}

const drawing = (e) => {
    if (!isDraw) return;
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser"?"#fff":brushColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

// Color picker
colorPicker.addEventListener('change',(e)=>{
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    console.log(colorPicker.value);
    colorPicker.parentElement.click();
}) 

// Choose the color
colorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelector('.colors .selected').classList.remove('selected');  // Removing the previous active class
        btn.classList.add('selected');  // Adding the active class on clicked element
        brushColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

// Download an image 
saveImg.addEventListener('click',()=>{
  
    let link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canva.toDataURL();
    link.click();
})

// Clear the canva
clearCanva.addEventListener('click',()=>{
    setCanvaBackground ();
    ctx.clearRect(0, 0, canva.width, canva.height);
})

// Increase/decrease the width of range slider
rangeSlider.addEventListener('change', () => {
    brushWidth = rangeSlider.value;
    console.log(brushWidth);
})


canva.addEventListener('mousedown', startDraw);
canva.addEventListener('mousemove', drawing);
canva.addEventListener('mouseup', () => isDraw = false);

// For touch screen devices
canva.addEventListener('touchstart', startDraw);
canva.addEventListener('touchmove', drawing);
canva.addEventListener('touchend', () => isDraw = false);