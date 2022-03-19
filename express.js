var express = require('express');
var path = require('path');
var cn = require("./mongo/conexion");
var bodyParse = require("body-parser");

var app = express();

app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
app.use("/estilos", express.static("./estilos"));
app.use("/files", express.static(path.join(__dirname, "files")));
app.use(bodyParse.json());

var cn = require("./mongo/conexion")

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "pages/reserva.html"));
})
app.get("/listarReservas/:orden", (request, response) => {
    cn.getAll(request, response);
})
app.get("/recuperarReservas/:id", (request, response) => {
    cn.getFindName(request, response);
})
app.post("/insertarReservas", (request, response) => {
    cn.insertarReserva(request, response);
});
//Envío de campos: agregar/insertar o editar/actualizar con post
app.post("/actualizarReservas", (request, response) => {
    cn.updateReserva(request, response);
});

app.put("/eliminarReservas/:id", (request, response) => {
    cn.deleteName(request, response);
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);