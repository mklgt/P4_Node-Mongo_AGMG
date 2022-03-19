var mongoose = require("mongoose");
var mongoClient = require("mongodb");

//Linea para conectarlo con Mongo Atlas
var cadenaConexion = "mongodb+srv://mgoicoeoca:wfk7hTXJTvFZ6wEF@clustermg.pz7eh.mongodb.net/Reservas?retryWrites=true&w=majority";
mongoose.connect(cadenaConexion, (err, res) => {
    if (err) {
        console.log('Ocurrió un error');
    } else {
        console.log('Se conectó correctamente');
    }
})

//Creamos la estructura de nuestro objemoc
var Schema = mongoose.Schema;

var objeto = new Schema({
    _id: Schema.Types.String,
    usuario: Schema.Types.String,
    aula: Schema.Types.String,
    fecha: Schema.Types.String,
    horaDesde: Schema.Types.String,
    horaHasta: Schema.Types.String,
}, {
    collection: "reservas"
});


var Reservas = mongoose.model("reservas", objeto);

class ReservaController {

    //Obtiene todos los registros de la vase de datos. Por defecto se ordenadar por id. Tambien pueden ser ordenados por usuario, fecha o aula.
    getAll(request, response) {
        let filtro = "";
        var orden = request.params.orden;
        switch (orden) {
            case "pre":
                filtro = {$sort: {_id: 1}}
                break;
            case "usu":
                filtro = {$sort: {usuario: 1}}
                break;
            case "fec":
                filtro = {$sort: {fecha: 1}}
                break;
            case "aul":
                filtro = {$sort: {aula: 1}}
                break;
        }

        Reservas.aggregate([filtro, {
            $project: {
                _id: 1,
                usuario: 1,
                aula: 1,
                fecha: 1,
                horaDesde: 1,
                horaHasta: 1
            }
        }]).then(res => {
            response.json(res)
        }).catch(err => {
            response.end("Ha ocurrido un error")
        })
    }

    //busca una sola reserva para el formulario
    getFindName(request, response) {
        var id = request.params.id;
        Reservas.aggregate([{
                $match: {
                    _id: id
                }
            },
            {
                $project: {
                    _id: 1,
                    usuario: 1,
                    aula: 1,
                    fecha: 1,
                    horaDesde: 1,
                    horaHasta: 1
                }
            }
        ]).then(res => {
            response.json(res);
        }).catch(err => {
            response.end(err);
        })
    }

    //Borra una reserva que se busca por un id unico
    deleteName(request, response) {
        var id = request.params.id;
        console.log('->' + id)
        Reservas.deleteOne({
            _id: id
        }).then(res => {
            response.json({
                estado: "OK"
            });
        }).catch(err => {
            response.json({
                estado: "ERROR"
            })
        })
    }

    //Actualiza una reserva en la base de datos
    updateReserva(request, response) {
        var id = request.body.id;
        var usuario = request.body.usuario;
        var aula = request.body.aula;
        var fecha = request.body.fecha;
        var horaDesde = request.body.horaDesde;
        var horaHasta = request.body.horaHasta;

        Reservas.updateOne({
            usuario: usuario
        }, {
            $set: {
                usuario: usuario,
                aula: aula,
                fecha: fecha,
                horaDesde: horaDesde,
                horaHasta: horaHasta,
            }
        }).then(res => {
            response.json({
                estado: "OK"
            });
        }).catch(err => {
            response.json({
                estado: "ERROR"
            });
        })
    }

    //Inserta una reserva en la base de datos
    insertarReserva(request, response) {
        var id = mongoose.Types.ObjectId();
        var usuario = request.body.usuario;
        var aula = request.body.aula;
        var fecha = request.body.fecha;
        var horaDesde = request.body.horaDesde;
        var horaHasta = request.body.horaHasta;

        var oReserva = new Reservas({
            "_id": id,
            "usuario": usuario,
            "aula": aula,
            "fecha": fecha,
            "horaDesde": horaDesde,
            "horaHasta": horaHasta
        })

        oReserva.save(function (err, res) {
            if (err) {
                console.log("Error al registrar")
            } else {
                console.log("OK");
                response.json({
                    estado: "OK"
                });
            }
        })
    }
}


module.exports = new ReservaController();