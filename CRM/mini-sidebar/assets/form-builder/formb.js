  const fbEditor = document.getElementById("DivFormBuilder");
  var formBuilder = null;

  $("#modal_form").on("hidden.bs.modal", function () {

      var formParentNode = document.getElementById("DivFormBuilder");
      while (formParentNode.firstChild) {
          formParentNode.removeChild(formParentNode.firstChild);
      }

      $('#btnSaveData').off('click');
    
  });

  $("#modal_form").on("shown.bs.modal", function (e) {    

      var formLoadData = null;

      var divContainer = $(e.relatedTarget).parent().parent();
      
      if ($(e.relatedTarget).hasClass('btnEditarForm')) {
          
          divContainer = $(e.relatedTarget).parent();
          formLoadData = $(e.relatedTarget).data('form');
      }

      var options = {
          
          formData: formLoadData,
          disableFields: ['autocomplete', 'button', 'hidden', 'file', 'number','select'],
          showActionButtons:false,
          i18n: {
              locale: 'es-ES'
          },
          editOnAdd: false
      };

      formBuilder = $(fbEditor).formBuilder(options);

      $("#btnSaveData").on('click', function () {

          let data = formBuilder.actions.getData('json', true);

          let htmlEditButton = `<span class='btnEliminarFila' title='Eliminar fila' onclick='eliminarFila(this)'><i class='fa fa-times fa-3x' style='color: #ffffff;background: #d02626;border-radius: 50px;width: 28px;padding: 4px 7px;font-size: 20px;position: absolute;left: -14px;top: -6px;'></i></span> <span class='btnEditarForm' title='Editar sección' style='cursor:pointer;' data-toggle='modal' data-target='#modal_form' data-form='`+ data +`'><i class='fa fa-cog fa-lg'></i></span>`;
          let formRenderOptions = {
              formData: data
          };
          $(divContainer).removeClass('initialAlignment');
          $(divContainer[0]).formRender(formRenderOptions);
          $(divContainer).append(htmlEditButton);
          

          $('#modal_form').modal('hide');

      });

  });

  function AgregarSeccion(cantidad_columnas) {

      let htmlContent = "<div class='abrirModal' style='display:inline-block'><a href='#' data-toggle='modal' data-target='#modal_form'><i class='fa fa-plus-circle fa-2x' style='color:#a4a2a2'></i></a></div>";
      let valorClase = 12 / cantidad_columnas;
      let html = "<div class='row ui-sortable-handle'>";
      for (let i = 1; i <= cantidad_columnas; i++) {

          html += `<div class="dimensionesDiv initialAlignment col-md-` + valorClase + `"><span class='btnEliminarFila' title='Eliminar fila' onclick='eliminarFila(this)'><i class='fa fa-times fa-3x' style='color: #ffffff;background: #d02626;border-radius: 50px;width: 28px;padding: 4px 7px;font-size: 20px;position: absolute;left: -14px;top: -6px;'></i></span>` + htmlContent + `</div>`
      }

      html += "</div>";
      $("#main_form").children(":first").append(html);
  }

  function eliminarFila(element) {            
      $($(element).parent()).remove();
  }

  function GuardarFormDB() {

      let arrayEspecialidadesId = $('#opciones_especialidades').val();
      let stringIds = '';
      let descripcion = $('#descripcion').val();

      arrayEspecialidadesId.forEach(x => {
          stringIds += x;
          stringIds += "|";
      });

      stringIds = stringIds.slice(0, -1);
      

      let htmlOriginal = document.getElementById('main_form').firstChild.outerHTML;

      let doc = document.createElement('div');

      doc.innerHTML = htmlOriginal;

      let buttons = doc.getElementsByClassName('btnEditarForm');
      let anchors = doc.getElementsByClassName('abrirModal');

      for (b of buttons) {

          $(b).addClass('elementHidden');

      }

      for (a of anchors) {
          $(a).addClass('elementHidden');
      }


      //while (buttons[0]) {
      //    buttons[0].parentNode.removeChild(buttons[0]);
      //}

      doc.innerHTML = doc.innerHTML.replace(/"/g, "'").trim();

      //var nuevoHtml = AddHtmlStructure(doc.innerHTML);
      let nuevoHtml = doc.innerHTML;

      let DocumentoClinico = {

          "Especialidades": stringIds,
          "Descripcion": descripcion,
          "FormHTML": nuevoHtml
      };

      console.log(DocumentoClinico)

     /* $.ajax({
          url: "/api/guardarDocumentoClinico",
          method: 'POST',
          data: JSON.stringify(DocumentoClinico),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (resp) {

              if (resp.msg == "Success") {
                  window.location = "/config_doc_clinicos"
              }
              else {
                  console.log("Error creando formulario")
              }

          }
      })*/
  }

  function LimpiarFormulario() {
      formBuilder.actions.clearFields();
  }

  function ActualizarFormDB() {

      let arrayEspecialidadesId = $('#opciones_especialidades').val();
      let stringIds = '';
      let descripcion = $('#descripcion').val();

      arrayEspecialidadesId.forEach(x => {
          stringIds += x;
          stringIds += "|";
      });

      stringIds = stringIds.slice(0, -1);

      let htmlOriginal = $("#main_form")[0].innerHTML;
      
      let doc = document.createElement('div');

      doc.innerHTML = htmlOriginal;

      let buttons = doc.getElementsByClassName('btnEditarForm');
      let anchors = doc.getElementsByClassName('abrirModal');

      for (b of buttons) {

          $(b).addClass('elementHidden');

      }

      for (a of anchors) {
          $(a).addClass('elementHidden');
      }

      //while (buttons[0]) {
      //    buttons[0].parentNode.removeChild(buttons[0]);
      //}

      doc.innerHTML = doc.innerHTML.replace(/"/g, "'").trim();

      //var nuevoHtml = AddHtmlStructure(doc.innerHTML);
      let nuevoHtml = doc.innerHTML;

      let DocumentoClinico = {
          "Id": $('#id_doc').val(),
          "Especialidades": stringIds,
          "Descripcion": descripcion,
          "FormHTML": nuevoHtml,
          "Estado": $('#checkEstado').is(':checked')
      };

      console.log(DocumentoClinico)

    /* $.ajax({
          url: "/api/actualizarDocumentoClinico",
          method: 'POST',
          data: JSON.stringify(DocumentoClinico),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (resp) {

              if (resp.msg == "Success") {
                  window.location = "/config_doc_clinicos"
              }
              else {
                  console.log("Error creando formulario")
              }

          }
      })*/
  }
