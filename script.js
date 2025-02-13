const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 2000;
canvas.height = 1200;

let painting = false;
let toolType = 'brush';
let brushColor = document.getElementById('color').value;
let fillColor = document.getElementById('color').value;
let brushSize = document.getElementById('brushSize').value;

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startPosition(e) {
    painting = true;
    const pos = getMousePos(canvas, e);
    if (toolType === 'brush') {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    } else if (toolType === 'pencil') {
        ctx.beginPath();
         ctx.moveTo(pos.x, pos.y);
    } else if (toolType === 'eraser') {
        erase(e);
    }
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function drawBrush(e) {
     if (!painting) return;
     const pos = getMousePos(canvas, e);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    ctx.globalAlpha = 0.5;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
     ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.globalAlpha = 1;
}

function drawPencil(e) {
    if (!painting) return;
     const pos = getMousePos(canvas, e);
     ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function erase(e) {
    if (!painting) return;
     const pos = getMousePos(canvas, e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', e => {
    if (painting) {
        if (toolType === 'brush') {
            drawBrush(e);
        } else if (toolType === 'pencil') {
            drawPencil(e);
        } else if (toolType === 'eraser') {
            erase(e);
        }
    }
});

document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('color').addEventListener('input', function(e) {
    brushColor = e.target.value;
    fillColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', function(e) {
    brushSize = e.target.value;
});

document.getElementById('tools').addEventListener('change', function(e) {
    toolType = e.target.value;
});

document.getElementById('fill').addEventListener('click', () => {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my_drawing.png';
    link.href = dataURL;
    link.click();
});
