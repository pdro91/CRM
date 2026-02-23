window.addEventListener('load', function() {
	var lastSymbol, lastBarText, lastAltText, lastOptions, lastRotate, lastScaleX, lastScaleY;
	try {
		lastSymbol	= '';
		lastBarText	= '';
		lastAltText	= '';
		lastOptions = localStorage.getItem('bwipjsLastOptions');
		lastRotate	= localStorage.getItem('bwipjsLastRotate');
		lastScaleX  = +localStorage.getItem('bwipjsLastScaleX');
		lastScaleY  = +localStorage.getItem('bwipjsLastScaleY');
	} catch (e) {
	}

	// Set up the select list of barcode types
	var sel = document.getElementById('symbol');
	var opts = [];
	for (var id in symdesc) {
		opts.push(symdesc[id]);
	}
	opts.sort(function (a,b) { return a.desc < b.desc ? -1 : 1 });
	for (var i = 0, l = opts.length; i < l; i++) {
		var elt = document.createElement('option');
		elt.textContent = opts[i].desc;
		elt.value = opts[i].sym;
		sel.appendChild(elt);
	}

	sel.addEventListener('change', function(ev) {
			var desc = symdesc[sel.value];
			if (desc) {
				document.getElementById('symtext').value = '';
				document.getElementById('symopts').value = desc.opts;
			} else {
				document.getElementById('symtext').value = '';
				document.getElementById('symopts').value = '';
			}
			document.getElementById('symaltx').value = '';
			document.getElementById('saveas').style.visibility = 'hidden';
			document.getElementById('stats').textContent = '';
			var canvas = document.getElementById('canvas');
			canvas.width = canvas.width;
		});

	if (lastSymbol) {
		sel.value = lastSymbol;
	} else {
		sel.selectedIndex = 0;
	}
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", false, true);
	sel.dispatchEvent(evt);

	if (lastBarText) {
		//document.getElementById('symtext').value = lastBarText;
		//document.getElementById('symaltx').value = lastAltText;
		document.getElementById('symopts').value = lastOptions;
	}
	if (lastScaleX && lastScaleY) {
		document.getElementById('scaleX').value = lastScaleX;
		document.getElementById('scaleY').value = lastScaleY;
	}
	if (lastRotate) {
		document.getElementById('rotate' + lastRotate).checked = true;
	}

	document.getElementById('scaleX').addEventListener('change', function(ev) {
			document.getElementById('scaleY').value = ev.target.value;
		});

	document.getElementById('render').addEventListener('click', validarcampo);
	
	document.getElementById('saveas').style.visibility = 'hidden';
	document.getElementById('saveas2').style.visibility = 'hidden';

	// Allow Enter to render
	document.getElementById('params').addEventListener('keypress', function(ev) {

		if (ev.which == 13) {
			render();
			ev.stopPropagation();
			ev.preventDefault();
			return false;
		}
	});

	//document.getElementById('versions').textContent = 'bwip-js ' + bwipjs.VERSION + ' / BWIPP ' + bwipjs.BWIPP.VERSION;

    // A reasonable match to OCR-B metrics.
    bwipjs.loadFont("Inconsolata", 95, 105, Inconsolata);
});

function validarcampo(){

	var numerotext = document.getElementById('symtext').value;
	if(numerotext.length == 6){		
		render();
		render2();	
	}else{
		alert("debe ingresar una serie de 6 digitos")
	}
}

function render() {
	var elt  = symdesc['ean13'];
	var text = document.getElementById('symtext').value.trim();
	var alttext = document.getElementById('symaltx').value.trim();
	var options = 'includetext guardwhitespace';
	var rotate = document.querySelector('input[name="rotate"]:checked').value;
	var scaleX = +document.getElementById('scaleX').value || 2;
	var scaleY = +document.getElementById('scaleY').value || 2;

	try {
		localStorage.setItem('bwipjsLastSymbol',  elt.sym);
		localStorage.setItem('bwipjsLastBarText', text);
		localStorage.setItem('bwipjsLastAltText', alttext);
		localStorage.setItem('bwipjsLastOptions', options);
		localStorage.setItem('bwipjsLastScaleX', scaleX);
		localStorage.setItem('bwipjsLastScaleY', scaleY);
		localStorage.setItem('bwipjsLastRotate', rotate);
	} catch (e) {
	}

	// Clear the page
	document.getElementById('output').value = '';
	document.getElementById('stats').value = '';
	document.getElementById('saveas').style.visibility = 'hidden';
	document.getElementById('output').textContent = '';

	var canvas = document.getElementById('canvas');
	canvas.height = 1;
	canvas.width  = 1;
	canvas.style.visibility = 'hidden';

	// Convert the options to an object.
	let opts = {};
	let aopts = options.split(' ');
	for (let i = 0; i < aopts.length; i++) {
		if (!aopts[i]) {
			continue;
		}
		var eq = aopts[i].indexOf('=');
		if (eq == -1) {
			opts[aopts[i]] = true;
		} else {
			opts[aopts[i].substr(0, eq)] = aopts[i].substr(eq+1);
		}
	}

	// Finish up the options
	opts.text = text;
	opts.bcid = elt.sym;
	opts.scaleX = scaleX;
	opts.scaleY = scaleY;
	opts.rotate = rotate;
	if (alttext) {
		opts.alttext = alttext;
	}

	// Draw the bar code to the canvas
	try {
		let ts0 = new Date;
		bwipjs.toCanvas(canvas, opts);
		show(ts0, new Date);
	} catch (e) {
		// Watch for BWIPP generated raiseerror's.
		var msg = (''+e).trim();
		if (msg.indexOf("bwipp.") >= 0) {
			document.getElementById('output').textContent = msg;
		} else if (e.stack) {
			// GC includes the message in the stack.  FF does not.
			document.getElementById('output').textContent = 
					(e.stack.indexOf(msg) == -1 ? msg + '\n' : '') + e.stack;
		} else {
			document.getElementById('output').textContent = msg;
		}
		return;
	}

	function show(ts0, ts1) {
		canvas.style.visibility = 'visible';
		setURL();
		document.getElementById('stats').textContent = 'Rendered in ' + (ts1-ts0) + ' msecs.';
		document.getElementById('saveas').style.visibility = 'visible';
		saveCanvas.basename = elt.sym + '-' + text.replace(/[^a-zA-Z0-9._]+/g, '-');
	}

	$(".descargarcodigo").show();
	
}
function render2() {
	var elt  = symdesc['qrcode'];
	var text = document.getElementById('symtext').value.trim();
	var alttext = document.getElementById('symaltx').value.trim();
	var options = 'eclevel=M';
	var rotate = document.querySelector('input[name="rotate"]:checked').value;
	var scaleX = +document.getElementById('scaleX').value || 2;
	var scaleY = +document.getElementById('scaleY').value || 2;

	try {
		localStorage.setItem('bwipjsLastSymbol',  elt.sym);
		localStorage.setItem('bwipjsLastBarText', text);
		localStorage.setItem('bwipjsLastAltText', alttext);
		localStorage.setItem('bwipjsLastOptions', options);
		localStorage.setItem('bwipjsLastScaleX', scaleX);
		localStorage.setItem('bwipjsLastScaleY', scaleY);
		localStorage.setItem('bwipjsLastRotate', rotate);
	} catch (e) {
	}

	// Clear the page
	document.getElementById('output2').value = '';
	document.getElementById('stats2').value = '';
	document.getElementById('saveas2').style.visibility = 'hidden';
	document.getElementById('output2').textContent = '';

	var canvas2 = document.getElementById('canvas2');
	canvas2.height = 1;
	canvas2.width  = 1;
	canvas2.style.visibility = 'hidden';

	// Convert the options to an object.
	let opts = {};
	let aopts = options.split(' ');
	for (let i = 0; i < aopts.length; i++) {
		if (!aopts[i]) {
			continue;
		}
		var eq = aopts[i].indexOf('=');
		if (eq == -1) {
			opts[aopts[i]] = true;
		} else {
			opts[aopts[i].substr(0, eq)] = aopts[i].substr(eq+1);
		}
	}

	// Finish up the options
	opts.text = text;
	opts.bcid = elt.sym;
	opts.scaleX = scaleX;
	opts.scaleY = scaleY;
	opts.rotate = rotate;
	if (alttext) {
		opts.alttext = alttext;
	}

	// Draw the bar code to the canvas
	try {
		let ts0 = new Date;
		bwipjs.toCanvas(canvas2, opts);
		show(ts0, new Date);
	} catch (e) {
		// Watch for BWIPP generated raiseerror's.
		var msg = (''+e).trim();
		if (msg.indexOf("bwipp.") >= 0) {
			document.getElementById('output2').textContent = msg;
		} else if (e.stack) {
			// GC includes the message in the stack.  FF does not.
			document.getElementById('output2').textContent = 
					(e.stack.indexOf(msg) == -1 ? msg + '\n' : '') + e.stack;
		} else {
			document.getElementById('output2').textContent = msg;
		}
		return;
	}

	function show(ts0, ts1) {
		canvas2.style.visibility = 'visible';
		setURL2();
		document.getElementById('stats2').textContent = 'Rendered in ' + (ts1-ts0) + ' msecs.';
		document.getElementById('saveas2').style.visibility = 'visible';
		saveCanvas2.basename = elt.sym + '-' + text.replace(/[^a-zA-Z0-9._]+/g, '-');
	}
}
function saveCanvas(type, ext) {
	var canvas = document.getElementById('canvas');
	canvas.toBlob(function (blob) {
					  saveAs(blob, saveCanvas.basename + ext);
				  }, type, 1);
}
function saveCanvas2(type, ext) {
	var canvas2 = document.getElementById('canvas');
	canvas2.toBlob(function (blob) {
					  saveAs(blob, saveCanvas2.basename + ext);
				  }, type, 1);
}
function setURL() {
	
	var elt  = symdesc['ean13'];
	var text = document.getElementById('symtext').value.trim();
	var alttext = document.getElementById('symaltx').value.trim();
	var options = 'includetextguardwhitespace';
	var rotate = document.querySelector('input[name="rotate"]:checked').value;
	var scaleX = +document.getElementById('scaleX').value || 2;
	var scaleY = +document.getElementById('scaleY').value || scaleX;

	var url = 'http://bwipjs-api.metafloor.com/?bcid=' + elt.sym + 
				'&text=' + encodeURIComponent(text) +
				(alttext ? '&alttext=' + encodeURIComponent(alttext) : '') +
				(options ? '&' + options.replace(/ +/g, '&') : '') +
				(rotate != 'N' ? '&rotate=' + rotate : '') +
				(scaleX == scaleY ? '&scale=' + scaleX
								  : '&scaleX=' + scaleX + '&scaleY=' + scaleY)
				;

	document.getElementById('apiurl').href = url;
}
function setURL2() {
	
	var elt  = symdesc['qrcode'];
	var text = document.getElementById('symtext').value.trim();
	var alttext = document.getElementById('symaltx').value.trim();
	var options = 'eclevel=M';
	var rotate = document.querySelector('input[name="rotate"]:checked').value;
	var scaleX = +document.getElementById('scaleX').value || 2;
	var scaleY = +document.getElementById('scaleY').value || scaleX;

	var url = 'http://bwipjs-api.metafloor.com/?bcid=' + elt.sym + 
				'&text=' + encodeURIComponent(text) +
				(alttext ? '&alttext=' + encodeURIComponent(alttext) : '') +
				(options ? '&' + options.replace(/ +/g, '&') : '') +
				(rotate != 'N' ? '&rotate=' + rotate : '') +
				(scaleX == scaleY ? '&scale=' + scaleX
								  : '&scaleX=' + scaleX + '&scaleY=' + scaleY)
				;

	document.getElementById('apiurl2').href = url;
}