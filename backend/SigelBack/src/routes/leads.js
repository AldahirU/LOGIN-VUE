const express = require('express');
const router = express.Router();
const pool = require('../db.js');

//Listar todos
router.get('/', async(req, res) =>{
    let listLead = await pool.query('SELECT * FROM leads');
    res.json({
        status: 200,
        message: "Se ha listado correctamente",
        listLead : listLead
    });
});

//Listar por ID
router.get('/:id', async(req, res) => {
    const { id } = req.params;      
    let lead = await pool.query('SELECT * FROM leads WHERE LeadID = ?',[id]);
    res.json({
        status: 200,
        message: "Se ha obtenido correctamente",
        lead : lead
    });
});

//Crear aqui me quede
router.post('/create', async(req, res) =>{
    const {Nombre} = req.body;
    

    const lead = {
        Nombre
    }

    await pool.query('INSERT INTO lead set ?', [lead]);
    res.json({
        status: 200,
        message: "Se ha registrado correctamente",
        lead : lead
    });

});

//Actualizar
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const {Nombre} = req.body;
    

    const lead = { Nombre, Correo, Passw};

    pool.query('UPDATE leads SET ? WHERE  id = ?', [lead, id]);
    res.json({
        status: 200,
        message: "Se ha actualizado correctamente",
        lead: lead
    });
});

module.exports = router;