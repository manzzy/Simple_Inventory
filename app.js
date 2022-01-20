const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser')
require('dotenv').config();

const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 3306
});

con.connect();


app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

// Get all items
app.get('/api/items', (req, res) => {
    con.query('SELECT * FROM items', (err, result) => {
        if (err) throw err;
        res.status(200).send(result)
    })

});

//Get Single item
app.get('/api/items/:id', (req, res) => {
    const { id } = req.params;
    con.query("SELECT * FROM items Where item_id = ? ", [id], (err, rows) => {
        if (err) throw err;
        if (rows.length != 0) {
            res.status(200).send(rows)
        } else {
            res.status(400).send({
                error_message: "Item with this id is not found"
            })
        }

    })
})

// Add an item
app.post('/api/items', (req, res) => {
    let { name, expire_date, quantity, unit_price, selling_price } = req.body;
    quantity = parseInt(quantity);
    let ex = (expire_date == "" || expire_date == nulll) ? "N/A" : expire_date; 
    unit_price = parseFloat(unit_price);
    selling_price = parseFloat(selling_price)
    console.log(req.body)
    let sql = `
        INSERT INTO items values (NULL, ?, ?, ?, ?, ?)
    `
    if (name == null || expire_date == null || quantity == null || unit_price == null || selling_price == null) {
        res.status(400).send({ message: "Bad / Null input" });
    } else {
        con.query(sql, [name, ex, quantity, unit_price, selling_price], (err, rows) => {
            if (err) throw err;
            res.status(200).send({ message: "successful insertion" })
        })
    }
});


// patch or edit 
app.patch("/api/items/:id", (req, res) => {
    let { id } = req.params;
    let msg= null;
    if(req.body.name != null) {
        let sql = ` UPDATE items 
            SET name = ?
            Where item_id = ?
        `
        con.query(sql, [req.body.name, id], async (err, rows) => {
            if(err) throw err;
            msg = await rows;
        })
    }
    if(req.body.expire_date != null) {
        let sql = ` UPDATE items 
            SET expire_date = ?
            Where item_id = ?

        `
        con.query(sql, [req.body.expire_date, id], async (err, rows) => {
            if(err) throw err;
            msg = await rows;
        })
    }
    if(req.body.quantity != null) {
        let sql = ` UPDATE items 
            SET quantity = ?
            Where item_id = ?
        `
        con.query(sql, [parseInt(req.body.quantity),id], async (err, rows) => {
            if(err) throw err;
            msg = await rows;
        })
    }

    if(req.body.unit_price != null) {
        let sql = ` UPDATE items 
            SET unit_price = ?
            Where item_id = ?
        `
        con.query(sql, [parseFloat(req.body.unit_price),id], async (err, rows) => {
            if(err) throw err;
            msg = await rows;
        })
    }

    if(req.body.selling_price != null) {
        let sql = ` UPDATE items 
            SET selling_price = ?
            Where item_id = ?
        `
        con.query(sql, [parseFloat(req.body.selling_price), id], async (err, rows) => {
            if(err) throw err;
            msg = await rows;
        })
    }

  
    res.json({ message: ' item with id ' + id + ' has been edited'});
    

    
})


// delete an item
app.delete('/api/items/:id', (req, res) => {
    let { id }= req.params;
    let sql = `DELETE FROM items WHERE item_id = ?`;
    let msg;
    con.query(sql, [id], async (err, rows) => {
        if (err) throw err;
        msg  = await rows;
    })
    res.json({ message: ' item with id ' + id + ' has been deleted'});


})
app.listen(process.env.PORT);