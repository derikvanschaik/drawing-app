class Line{
    constructor(x, y){
        this.startPos = [x, y];
        this.dragPath = [this.startPos]; 
        this.endPos; 
    }
    setEndPos(x, y){
        this.endPos = [x, y]; 
    }
    addToPath(newX, newY){
        this.dragPath.push([newX, newY]); 
    }
    drawLine(ctx){
        if (this.dragPath.length >= 2){
            // console.log("in draw line condition"); 
            const [fromX, fromY] = this.dragPath[this.dragPath.length -2]; 
            const [toX, toY] = this.dragPath[this.dragPath.length -1];
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);  
            ctx.stroke();
        }
    }
    drawPoint(ctx, x, y){
        const [w, h] = [2, 2]; 
        ctx.fillRect(x,y,w,h);
    }  
}
// returns x and y locations on canvas 
const getCursorPosition = (canvas, event) => {  
    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y]; 
}
const addPosAndDraw = (ctx,curLine, x, y) =>{
    curLine.addToPath(x, y);
    curLine.drawLine(ctx);
}
// 'main' function 
window.onload = () =>{
    // element references 
    const canvas = document.querySelector("#canvas");
    const colorPicker = document.querySelector("#color-picker"); 
    const thicknessPicker = document.querySelector("#pencil-width"); 
    const undoButton = document.querySelector("#undo");
    const clearButton = document.querySelector("#clear");
    // configurations 
    ctx = canvas.getContext('2d');
    // variables 
    const lines = []; 
    const states = [];
    let curState;
    let curLine; 

    canvas.addEventListener("mousedown", (event) =>{
        if (curLine){
            return; 
        }
        const [x, y] = getCursorPosition(canvas, event); 
        curLine = new Line(x, y); 
    });
    canvas.addEventListener("mousemove", (event) =>{
        if (!curLine){
            return; 
        }
        const [x, y] = getCursorPosition(canvas, event); 
        addPosAndDraw(ctx, curLine, x, y); 
    }); 
    canvas.addEventListener("mouseup", (event) =>{
        if(!curLine){
            return; 
        }
        const [x, y ] = getCursorPosition(canvas, event); 
        addPosAndDraw(ctx, curLine, x, y); 
        curLine.setEndPos(x, y);
        if(x === curLine.startPos[0] && y === curLine.startPos[1]){
            // need to draw a single point
            curLine.drawPoint(ctx, x, y); 
        }
        curLine = null; 
    }); 






}