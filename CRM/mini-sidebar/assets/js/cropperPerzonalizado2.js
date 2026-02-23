//FUNCIONES

		$("#BtnCerrar").click(function(){			
    		$("#modal").hide();
	    });
	    
		function eliminarImagen(indice){    
    		
    		for (var i =0; i <data.length; i++){
			   if (data[i].Indice === indice) {
			      data.splice(i,1);
			   }
			}
    		pintartabla(data);
    	}

		$("#imgInp").change(function(){			
	        subirImagenes();
	       // readURL(this);
	       // pintartabla();
	        $("#imgInp").val(null);
	    });

	  	function readURL(input) {
    	  	
	        if (input.files && input.files[0]) {
	       
	            for (var a = 0; a < input.files.length; ++a) {
	              	var reader = new FileReader()
	              
	              	reader.onload = function (e) {
	              	for (var i = 0; i < data.length; i++) {
	              		data[i].imagenBase =  e.target.result; 
	              	}             		
	          
	              }		              
	              reader.readAsDataURL(input.files[a]);
	              
	            }
	        }	       
	    }

	    function getBase64(file) {
		  return new Promise((resolve, reject) => {
		    const reader = new FileReader();
		    reader.readAsDataURL(file);
		    reader.onload = () => resolve([reader.result, file]);
		    reader.onerror = error => reject(error);
		  });
		}

	    function subirImagenes(){
    		let files = document.getElementById('imgInp').files;
    		let datapost = [];    		
    		let color = "";

			for (var i = 0; i < files.length; i++) {	
				getBase64(files[i]).then(
					base64 => {
					
					  	let indice = 1;

				        if (data.length != 0) {
				            indice = Number(data[data.length - 1].Indice) + 1;
				        } 		

				        if (indice % 2 == 0){
		        			color = "#f9f9f9";
		        		}else{
		        			color = "#ffffff";
		        		}

						let obj = 
								{	"Indice":indice,			
									"file": base64[1],
									//"nombre": base64[1].name,
									"imagenBase": base64[0],
									"tipoDocumento": "",
									"numero": "",
									"fechaEmision":"",
									"fechaVencimiento": "",
									"colors": color
								}
						data.push(obj);							
					}
				  	 
				);	

				if(i+1 == files.length){
					setTimeout(function(){ pintartabla(data); }, 1000);					
				}		
			}						
		}

	    function pintartabla(lista){
	  		console.log(lista);
	  		$("#listaDocumentos").empty();	   
	    	
	    	for (var i = 0; i < lista.length; i++) {	 
	    						
					$("#listaDocumentos").append(`<div class="row" style="background: ${lista[i].colors};">
						<div class="col-md-1 vertical-center">
							<center>${lista[i].Indice}</center>
						</div>

						<div class="col-md-2 vertical-center">
							<center><div id="preview${lista[i].Indice}" class="edit"><img onClick="cortar(${lista[i].Indice})" src="${lista[i].imagenBase}" style=" width: 150px; height:100px; padding: 10px" data-target="#modal" data-toggle="modal" /> 
							</div></center>
						</div>
						
						<div class="col-md-2 vertical-center">
							<center>
							<select id="cboTipoDocumento${lista[i].Indice}" class="form-control show-tick">
                                <option>- Tipo Documento</option>
                            </select>
                            </center>
						</div>
						<div class="col-md-2 vertical-center">
							<center><input type="textNumero${lista[i].Indice}" class="form-control" placeholder="Número"></center>
						</div>						
						<div class="col-md-2 vertical-center">
							<center><input type="textFechaEmision${lista[i].Indice}" data-provide="datepicker" class="form-control date" placeholder="Ex: 30/07/2016"></center>
						</div>
						<div class="col-md-2 vertical-center">
							<center><input type="textFechaVencimiento${lista[i].Indice}" data-provide="datepicker" class="form-control date" placeholder="Ex: 30/07/2016"></center>
						</div>
						<div class="col-md-1 vertical-center">
							<center>
							<button onClick="eliminarImagen(${lista[i].Indice})" type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button>
							</center>
						</div>
					</div>`);
			}
	    }

//CROPPER
// vars
        let result = document.querySelector('.result'),
        img_result = document.querySelector('.img-result'),
        img_w = document.querySelector('.img-w'),
        img_h = document.querySelector('.img-h'),
        options = document.querySelector('.options'),
        save = document.querySelector('.save'),
        cropped = document.querySelector('.cropped'),
        dwn = document.querySelector('.download'),                
        cropper = '';

        // on change show image with crop options
        function cortar(indice){
        	$("#modal").show();
        	$("#indiceImg").val(indice) ;
        	
        	for (var j = 0; j < data.length; j++) {
        		if(data[j].Indice == indice){
        			e = data[j].file;
        		}
        	}
       
            // start file reader
            const reader = new FileReader();
            reader.onload = (e)=> {
              if(e.target.result){
                    // create new image
                    let img = document.createElement('img');
                    img.id = 'image';
                    img.src = e.target.result
                    // clean result before
                    result.innerHTML = '';
                    // append new image
            		result.appendChild(img);
                    // show save btn and options
                    save.classList.remove('hide');
                    options.classList.remove('hide');
                    // init cropper
                    cropper = new Cropper(img);
              }
            };
            reader.readAsDataURL(e);
          
        };

        // save on click
        save.addEventListener('click',(e)=>{
          	e.preventDefault();
          	// get result to data uri
          	let imgSrc = cropper.getCroppedCanvas({
                width: img_w.value // input value
            }).toDataURL();
          	// remove hide class of img
          	cropped.classList.remove('hide');
            img_result.classList.remove('hide');
            // show image cropped
          	cropped.src = imgSrc;
          	dwn.classList.remove('hide');
          	dwn.download = 'imagename.png';
          	dwn.setAttribute('href',imgSrc);
         
          	for (var x = 0; x < data.length; x++) {
          		if(data[x].Indice == $("#indiceImg").val())
          		{
          			data[x].imagenBase = imgSrc
          		}
          	
          	}
          	pintartabla(data);
          	$("#modal").hide();
        });