const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// CONEXIÓN MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.log("Error MongoDB:", err));


// ESQUEMA DE DATOS
const climaSchema = new mongoose.Schema({

    temperatura: String,
    presion: String,
    lux: Number,
    wm2: Number,
    hall: Number,
    suelo: Number,

    fecha: {
        type: Date,
        default: Date.now
    }

});


// MODELO
const Clima = mongoose.model("Clima", climaSchema);


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Servidor estación climática activo");
});


// RECIBIR DATOS
app.post("/datos", async (req, res) => {

    try {

        const nuevoDato = new Clima(req.body);

        await nuevoDato.save();

        res.json({
            mensaje: "Datos guardados"
        });

    } catch (error) {

        res.status(500).json({
            error: error.toString()
        });

    }

});


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});


// VER DATOS
app.get("/ver", async (req, res) => {

    try {

        const datos = await Clima.find().sort({ fecha: -1 }).limit(20)

        let html = `
        <h1>Estación Climática</h1>
        <table border="1" cellpadding="10">
        <tr>
            <th>Temperatura</th>
            <th>Presión</th>
            <th>Lux</th>
            <th>W/m²</th>
            <th>Hall</th>
            <th>Suelo</th>
            <th>Fecha</th>
        </tr>
        `

        datos.forEach(d => {

            html += `
            <tr>
                <td>${d.temperatura}</td>
                <td>${d.presion}</td>
                <td>${d.lux}</td>
                <td>${d.wm2}</td>
                <td>${d.hall}</td>
                <td>${d.suelo}</td>
                <td>${d.fecha}</td>
            </tr>
            `

        })

        html += `</table>`

        res.send(html)

    } catch (error) {

        res.send(error.toString())

    }

});