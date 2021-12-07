require("dotenv").config();

const { Client } = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json()); // middleware to deserialize JSON in request
app.use(cors()); // middleware to allow cross-domain AJAX requests


app.get("/api/brackets", (request, response) => {
    const client = createClient();

    client.connect().then(() => {
        client.query('SELECT * FROM brackets').then((queryResponse) => {
            response.json(queryResponse.rows);
        });
    });
});

app.get("/api/brackets/:id", (request, response) => {
    const client = createClient();

    client.connect().then(() => {
        client
            .query("SELECT * FROM brackets WHERE id = $1", [request.params.id])
            .then((queryResponse) => {
                response.json(queryResponse.rows[0]);
            });
    });
});

app.post("/api/brackets", (request, response) => {
    const client = createClient();

    client.connect().then(() => {
        client
            .query("INSERT INTO brackets (name, userid, bracket, date) VALUES ($1, $2, $3, $4) RETURNING *", [
                request.body.name,
                request.body.userid,
                request.body.bracket,
                request.body.date,
            ])
            .then((queryResponse) => {
                response.json(queryResponse.rows[0]);
            });
    });
});

app.delete("/api/brackets/:id", (request, response) => {
    const client = createClient();

    client.connect().then(() => {
        client
            .query("DELETE FROM brackets WHERE id = $1", [request.params.id])
            .then((queryResponse) => {
                if (queryResponse.rowCount === 1) {
                    response.status(204).send();
                } else {
                    response.status(404).send();
                }
            });
    });
});

function createClient() {
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
    });

    return client
}


app.listen(3000);