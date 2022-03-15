//alert("Hola txabales");
window.onload = function () {
    listar();
}

function listar() {
    fetch("/listarReservas").then(res => {
        res.json().then(json => {
            //alert(JSON.stringify(json));
            listarReservas(json);
        })
    })
}

function listarReservas(res) {
    var contenido = `
    <table class="table">
    <thead>
            <tr>
                <th>Usuario</th>
                <th>Aula</th>
                <th>Fecha</th>
                <th>HoraDesde</th>
                <th>HoraHasta</th>
            </tr>
    </thead>`;
    contenido += "<tbody>";
    for (var i = 0; i < res.length; i++) {
        data = res[i];
        contenido += `
            <tr>
                <td>${data.usuario}</td>
                <td>${data.aula}</td>
                <td>${data.fecha}</td>
                <td>${data.horaDesde}</td>
                <td>${data.horaHasta}</td>
                <td>
                <button class='btn btn-primary' onclick='verFormulario("${data.usuario}")'>
                Editar
                </button>
                <button class='btn btn-danger' onclick='eliminar("${data.usuario}")'>
                Eliminar
                </button>
                </td>
            </tr>`;
    }
    contenido += "</tbody>";
    contenido += "</table>";
    document.getElementById("divReserva").innerHTML = contenido;
}

function verFormulario(usuario) {
    document.getElementById("divError").style.display = "none";
    document.getElementById("divFormulario").style.display = "block";
    limpiar();
    if (usuario != null) {
        recuperarReserva(usuario);
    }
}

function ocultarFormulario() {
    document.getElementById("divFormulario").style.display = "none";
    document.getElementById("divError").style.display = "none";
}

function recuperarReserva(usuario) {
    fetch("/recuperarReservas/" + usuario)
        .then(res => {
            res.json().then(json => {
                var data = json[0];
                document.getElementById('txtId').value = data._id;
                document.getElementById("txtUsuario").value = data.usuario;
                document.getElementById("txtAula").value = data.aula;
                document.getElementById("txtFecha").value = data.fecha;
                document.getElementById("txtHoraDesde").value = data.horaDesde;
                document.getElementById("txtHoraHasta").value = data.horaHasta;
            })
        }).catch(err => {
            alert(err);
        })
}

function limpiar() {
    document.getElementById('txtId').value = "";
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtAula").value = "";
    document.getElementById("txtFecha").value = "";
    document.getElementById("txtHoraDesde").value = "";
    document.getElementById("txtHoraHasta").value = "";
}

function enviarDatos() {
    var id = document.getElementById('txtId').value;
    var usuario = document.getElementById('txtUsuario').value;
    var aula = document.getElementById("txtAula").value;
    var fecha = document.getElementById("txtFecha").value;
    var horaDesde = document.getElementById("txtHoraDesde").value;
    var horaHasta = document.getElementById("txtHoraHasta").value;

    //Validación de información
    var exito = true;
    var contenido = "<ul>";
    if (usuario == "") {
        contenido += "<li>Debe ingresar un usuario</li>"
        exito = false;
    }
    if (aula == "") {
        contenido += "<li>Debe ingresar un aula</li>"
        exito = false;
    }
    if (fecha == "") {
        contenido += "<li>Debe ingresar un fecha</li>"
        exito = false;
    }
    if (horaDesde == "") {
        contenido += "<li>Debe ingresar una hora de inicio</li>"
        exito = false;
    }
    if (horaHasta == "") {
        contenido += "<li>Debe ingresar una hora final de reserva</li>"
        exito = false;
    }
    contenido += "</ul>";
    if (!exito) {
        document.getElementById("divError").style.display = "block";
        document.getElementById('divError').innerHTML = contenido;
        return;
    } else {
        var ruta = "";
        if (id == "") {
            ruta = "/insertarReservas";
        } else {
            ruta = "/actualizarReservas";
        }

        var jsonData = {
            "usuario": usuario,
            "aula": aula,
            "fecha": fecha,
            "horaDesde": horaDesde,
            "horaHasta": horaHasta
        }

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        };

        fetch(ruta, options)
            .then(res => {
                res.json().then(rpta => {
                    if (rpta.estado == "OK") {
                        alert("Se ha actualizado correctamente");
                        listar();
                        ocultarFormulario();
                    } else {
                        alert("Ocurrió un error")
                    }
                })
            }).catch(err => {
                alert("Ocurrio un error:", err)
            })
    }
}


function eliminar(usuario) {
    console.log(usuario)
    if ( confirm("¿Deseas eliminar el registro?") == 1) {
        fetch("/eliminarReservas/" + usuario, {
            method: "PUT"
        }).then(res => {
            res.json().then(rpta => {
                if (rpta.estado == "OK") {
                    alert("Se eliminó correctamente")
                    listar();
                    ocultarFormulario();
                } else {
                    alert("Ocurrio un error")
                }
            })
        }).catch(err => {
            alert(err);
        })
    }
}