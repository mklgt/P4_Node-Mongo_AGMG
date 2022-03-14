var mongoose = require("mongoose");
var mongoClient  = require("mongodb");

//var cadenaConexion = "mongodb://localhost/reservas";
//Linea para conectarlo con Mongo Atlas
var cadenaConexion = "mongodb+srv://mgoicoeoca:wfk7hTXJTvFZ6wEF@clustermg.pz7eh.mongodb.net/Reservas?retryWrites=true&w=majority";
mongoose.connect(cadenaConexion, (err, res) => {
    if (err) {
        console.log('Ocurrió un error');
    } else {
        console.log('Se conectó correctamente');
    }
})

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

    getAll(request, response) {
        Reservas.aggregate([{
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

    getFindName(request, response) {
        var usuario = request.params.usuario;
        Reservas.aggregate([{
                $match: {
                    usuario: usuario
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

    deleteName(request, response) {
        var usuario = request.params.usuario;
        //console.log(usuario)
        Reservas.deleteOne({
            usuario: usuario
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

    updateReserva(request, response) {
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

        oReserva.save(function(err, res) {
            if(err) {
                console.log("Error al registrar")
            }else {
                console.log("OK");
                response.json({estado : "OK"});
            }
        })
    }
}


module.exports = new ReservaController();