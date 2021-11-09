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
    drawLine(ctx, x1, y1, x2, y2){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);   
        ctx.stroke();
    }
    drawLineSection(ctx){
        if (this.dragPath.length >= 2){
            // console.log("in draw line condition"); 
            const [fromX, fromY] = this.dragPath[this.dragPath.length -2]; 
            const [toX, toY] = this.dragPath[this.dragPath.length -1];
            this.drawLine(ctx, fromX, fromY, toX, toY); 
        }
    }
    drawPoint(ctx, x, y){
        const [w, h] = [2, 2]; 
        ctx.fillRect(x,y,w,h);
    }
    redrawLine(ctx){ 
        const [fromX, fromY] = this.startPos; 
        const [toX, toY] = this.endPos;
        if (fromX !== toX && fromY !== toY){
            let tail = this.dragPath.length;  
            while(tail -2 >= 0){
                const [x1, y1] = this.dragPath[tail-1]; 
                const [x2, y2] = this.dragPath[tail-2]; 
                this.drawLine(ctx, x1, y1, x2, y2);
                tail--; 
            }
        }else{
            this.drawPoint(ctx, fromX, fromY); 
        }
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
    curLine.drawLineSection(ctx); 
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
    let lines = []; 
    let curLine;
    let lastDrawn; 

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
        // create state 
        lines.push(curLine);
        lastDrawn = curLine;  
        curLine = null;
         
    });

    undoButton.addEventListener("click", ()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        // redraw lines without last line 
        lines = lines.filter(line => line !== lastDrawn); 
        lines.forEach(line => line.redrawLine(ctx));
        if (lines.length > 0){
            lastDrawn = lines[lines.length -1 ]; 
        }

    }); 






}