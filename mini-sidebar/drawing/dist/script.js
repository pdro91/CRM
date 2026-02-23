// SETTING ALL VARIABLES
		

		var isMouseDown=false;
		var canvas = document.createElement('canvas');
		var body = document.getElementById("bodycanvas");[0];
		var ctx = canvas.getContext('2d');
		var linesArray = [];
		currentSize = 6;
		var currentColor = "rgb(200,20,100)";
		var img = document.getElementById("lamp")
		console.log(img)	
		var pattern = ctx.createPattern(img, 'no-repeat');
		console.log(pattern)
		var currentBg = pattern;
		var contador = 0;

		// INITIAL LAUNCH

		createCanvas();

		// BUTTON EVENT HANDLERS

		document.getElementById('canvasUpdate').addEventListener('click', function() {
			createCanvas();
			redraw();
		});
		document.getElementById('colorpicker').addEventListener('change', function() {
			currentColor = this.value;
		});
		$("#colorpicker").blur(function () {
	      	currentColor = this.value;
	    });
		document.getElementById('bgcolorpicker').addEventListener('change', function() {
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			redraw();
			currentBg = ctx.fillStyle;
		});
		document.getElementById('controlSize').addEventListener('change', function() {
			currentSize = this.value;
			document.getElementById("showSize").innerHTML = this.value;
		});
		document.getElementById('saveToImage').addEventListener('click', function() {
			
			console.log(this)
			downloadCanvas(this, 'canvas', 'masterpiece.png');
		}, false);
		document.getElementById('eraser').addEventListener('click', eraser);
		document.getElementById('clear').addEventListener('click', createCanvas);
		document.getElementById('save').addEventListener('click', save);
		document.getElementById('load').addEventListener('click', load);
		document.getElementById('clearCache').addEventListener('click', function() {
			localStorage.removeItem("savedCanvas");
			linesArray = [];
			console.log("Cache cleared!");
		});

		// REDRAW 

		function redraw() {
			
				for (var i = 1; i < linesArray.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
					ctx.lineWidth  = linesArray[i].size;
					ctx.lineCap = "round";
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();

				console.log(linesArray)
				}
		}

		// DRAWING EVENT HANDLERS

		canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
		canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
		canvas.addEventListener('mouseup',function() {mouseup(canvas, event);});

		// CREATE CANVAS

		function createCanvas() {
		
			canvas.id = "canvas";
			canvas.width = parseInt(document.getElementById("sizeX").value);
			canvas.height = parseInt(document.getElementById("sizeY").value);
			canvas.style.zIndex = 8;
			canvas.style.position = "absolute";
			canvas.style.border = "1px solid";
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);
			body.appendChild(canvas);
			console.log(canvas)
		}

		// DOWNLOAD CANVAS

		function downloadCanvas(link, canvas, filename) {
			console.log(link)
			console.log(canvas)
			console.log(filename)
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// SAVE FUNCTION

		function save() {
			localStorage.removeItem("savedCanvas");
			localStorage.setItem("savedCanvas", JSON.stringify(linesArray));
			console.log(linesArray);
		}

		// LOAD FUNCTION

		function load() {
			if (localStorage.getItem("savedCanvas") != null) {
				linesArray = JSON.parse(localStorage.savedCanvas);
				var lines = JSON.parse(localStorage.getItem("savedCanvas"));
				for (var i = 1; i < lines.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
					ctx.lineWidth  = linesArray[i].size;
					ctx.lineCap = "round";
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();
				}
				console.log("Canvas loaded.");
			}
			else {
				console.log("No canvas in memory!");
			}
		}

		// ERASER HANDLING

		function eraser() {
			currentSize = 6;
			currentColor = ctx.fillStyle
		}

		// GET MOUSE POSITION

		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}

		// ON MOUSE DOWN

		function mousedown(canvas, evt) {
			var mousePos = getMousePos(canvas, evt);
			isMouseDown=true
			var currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y)
			ctx.beginPath();
			ctx.lineWidth  = currentSize;
			ctx.lineCap = "round";
			ctx.strokeStyle = currentColor;
		}

		// ON MOUSE MOVE

		function mousemove(canvas, evt) {
			if(isMouseDown){
				var currentPosition = getMousePos(canvas, evt);
				ctx.lineTo(currentPosition.x, currentPosition.y)
				ctx.stroke();
				store(currentPosition.x, currentPosition.y, currentSize, currentColor);
			}
		}

		// STORE DATA

		function store(x, y, s, c) {
			
			var line = {
				"x": x,
				"y": y,
				"size": s,
				"color": c
			}
			linesArray.push(line);

		}

		// ON MOUSE UP

		function mouseup(canvas, evt) {
			isMouseDown=false
			contador = contador + 1;
			var currentPosition = getMousePos(canvas, evt);
			$("#notascolor").append(`<div class="col-md-2" style="text-align:right;"> 
										<label style="background:${currentColor}; border-radius:50px; width: 20px;height: 20px; color:#ffffff; text-align:center">${contador}</label> 
										</div> <div class="col-md-10">  
										<textarea></textarea> 
										</div>`)
			ctx.beginPath();
			ctx.lineWidth  = "3";
			ctx.fillStyle = "#f9f9f9";
			ctx.arc(currentPosition.x+25,currentPosition.y-25,11,0,2*Math.PI);
			ctx.stroke();
			ctx.font = "16px Arial";
			ctx.fillStyle = "#000000";
			ctx.textAlign = "center";
			ctx.fillText(contador,currentPosition.x+25,currentPosition.y-20);
			store()
		}

		function getBase64Image(img) {
		  var canvas = document.createElement("canvas");
		  canvas.width = img.width;
		  canvas.height = img.height;
		  var ctx = canvas.getContext("2d");
		  ctx.drawImage(img, 0, 0);
		  var dataURL = canvas.toDataURL();
		  return dataURL;
		}