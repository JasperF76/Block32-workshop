const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL ||
    'postgres://jasja:J@$Dogg122@localhost/acme_ice_cream_db'
);
const app = express();
app.use(express.json());
app.use(require('morgan')('dev'));

const init = async () => {
    // CREATES A FLAVOR
    app.post('/api/flavors', async (req, res, next) => {
        try {
            const SQL = `
            INSERT INTO flavors(name)
            VALUES($1)
            RETURNING *
            `;
            const response = await client.query(SQL, [ req.body.name ]);
            res.send(response.rows[0]);
        } catch (error) {
            next(error);
        }
    });
    // GETS AN ARRAY OF FLAVORS
    app.get('/api/flavors', async (req, res, next) => {
        try {
            const SQL = `SELECT * from flavors ORDER BY created_at DESC`;
            const response = await client.query(SQL);
            res.send(response.rows);
            
        } catch (error) {
            next(error);
        }
    });
    // GETS A SINGLE FLAVOR
    app.get('/api/flavors/:id', async (req, res, next) => {
        try {
            const SQL = `SELECT * from flavors ORDER BY created_at DESC`;
            const response = await client.query(SQL, [req.params.id]);
            res.send(response.rows);
            
        } catch (error) {
            next(error);
        }
    });

    // UPDATES A FLAVOR
    app.put('/api/flavors/:id', async (req, res, next) => {
        try {
            const SQL = `
            UPDATE notes
            SET name=$1, is_favorite=$2, updated_at= now()
            WHERE id=$3 RETURNING *
            `;
            const response = await client.query(SQL, [ req.body.txt,
                req.body.is_favorite, req.params.id]);
                res.send(response.rows[0]);
        } catch (error) {
            
        }
    });
    // DELETES A FLAVOR
    app.delete('/api/flavors/:id', async (req, res, next) => {
        try {
            const SQL = `
            DELETE from flavors
            WHERE id = $1
            `;
            const response = await client.query(SQL, [ req.params.id ]);
            res.sendStatus(204);
        } catch (error) {
            
        }
    });

    await client.connect();
    console.log('connected to database');
    let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    );
    INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', true);
    INSERT INTO flavors(name, is_favorite) VALUES('Chocolate', false);
    INSERT INTO flavors(name) VALUES('Strawberry');
    `;
    
    await client.query(SQL);
    console.log('tables created');

    SQL = `
    
    `
    await client.query(SQL);
    console.log('data seeded');

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
    
};

init();