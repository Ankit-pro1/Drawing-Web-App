let canva = document.querySelector('canvas'),
ctx = canva.getContext('2d'),
toolBtns = document.querySelectorAll('.tools'),
fillColor = document.querySelector('#fill-color');


let prevMouseX, prevMouseY, snapshot,
isDraw = false,
selectedTool = "brush";
brushWidth = 5;

window.addEventListener('load',()=>{
    canva.width = canva.offsetWidth;
    canva.height = canva.offsetHeight;
})

toolBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{

        document.querySelector('.options .active').classList.remove('active');  // Removing the previous active class
        btn.classList.add('active');  // Adding the active class on clicked element
        selectedTool = btn.id;  
        // console.log(selectedTool);

    })
})

// Draw Circle
const drawCircle = (e) =>{
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2) + Math.pow((prevMouseY - e.offsetY),2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked?ctx.fill():ctx.stroke();
}

// Draw Rectangle
const drawRect = (e) =>{
    if(!fillColor.checked){
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }else{
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }
}

// Draw Line
const startDraw = (e) =>{
    isDraw = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    snapshot = ctx.getImageData(0, 0, canva.width, canva.height);
}

const drawing=(e)=>{
    if(!isDraw) return;
    ctx.putImageData(snapshot, 0, 0)
    if(selectedTool === "brush"){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }
    
}
canva.addEventListener('mousedown', startDraw);
canva.addEventListener('mousemove', drawing);
canva.addEventListener('mouseup',()=>isDraw=false);