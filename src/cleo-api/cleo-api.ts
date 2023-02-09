import { JournalRepository } from "../journal-repository/journal-repository";

import bodyParser = require("body-parser");
import express = require("express");

const app = express();
app.use(bodyParser.json());

export class CleoAPI {
    port: number;
    constructor(port: number, journalsRepository: JournalRepository) {
        this.port = port;

        app.delete('/journals/', (req, res) => {
            res.send("Delete Called.");
            const id = req.query.id;
            journalsRepository.deleteJournal(id.toString());
            console.log('API delete: ', id);
            // res.json(req.body);
        });

        app.get('/', (req, res) => {
            res.send('Good day.');
        });

        app.get('/journals/', async (req, res) => {
            try {
                const idQuery = req.query.id.toString();
                const journal = await journalsRepository.getJournal(idQuery);
                res.json(journal);
            }
            catch (e) {
                const journals = await journalsRepository.getJournals();
                res.json(journals);
            }
        });

        app.post('/journals/', async (req, res) => {
            const name = req.body.name;
            await journalsRepository.createJournal(name);
            res.json(req.body);
        });
    };

    run() {
        app.listen(this.port, () => {
            console.log("Cleo here. I'm listening on port " + this.port);
        });
    };
}