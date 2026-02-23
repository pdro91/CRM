 $('#TablaPerfiles').DataTable( {
        language: {
            processing:     "Traitement en cours...",
            search:         "Buscar",
            lengthMenu:    "Mostrar _MENU_ Resultados",
            info:           "Resultados _END_ de _TOTAL_",
            infoEmpty:      "No hay registros disponibles.",
            infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            infoPostFix:    "",
            loadingRecords: "Cargando...",
            zeroRecords:    "No se encontraron Resultados",
            emptyTable:     "No hay datos disponibles en la tabla.",
            paginate: {
                first:      "Primero",
                previous:   "Anterior",
                next:       "Siguiente",
                last:       "Ultimo"
            },
            aria: {
                sortAscending:  ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
        }
    } );