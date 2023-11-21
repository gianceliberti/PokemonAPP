const express = require('express');
const router = express.Router();
const trainersController = require('./trainersController');

// Definir rutas CRUD
router.get('/', trainersController.getTrainers);
router.get('/:id', trainersController.getTrainerById);
router.post('/', trainersController.addTrainer); // línea para la creación de entrenadores
router.put('/:id', trainersController.updateTrainer);
router.delete('/:id', trainersController.deleteTrainer);

module.exports = router;
