const trainersData = require('./trainersData.js');

// Lógica de negocio para operaciones CRUD
exports.getTrainers = () => trainersData;

exports.getTrainerById = (id) => trainersData.find(trainer => trainer.id === id);

exports.addTrainer = ({ id, name, ...newTrainer }) => {
  try {
    if (!id || !name) {
      throw new Error('Both ID and name are required.');
    }

    // Crear el nuevo entrenador con el nuevo ID y nombre
    const trainer = { id, name, ...newTrainer };

    // Agregar el nuevo entrenador a la lista
    trainersData.push(trainer);

    return trainer;  // Devuelve directamente el objeto del entrenador
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el controlador
  }
};


exports.updateTrainer = (id, updatedTrainerData) => {
  try {
    const index = trainersData.findIndex(trainer => trainer.id == id);

    if (index === -1) {
      return null; // No se encontró el entrenador
    }

    // Actualizar el entrenador con los nuevos datos
    trainersData[index] = { ...trainersData[index], ...updatedTrainerData };

    return trainersData[index];
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el controlador
  }
};

exports.deleteTrainer = (id) => {
  try {
    const index = trainersData.findIndex(trainer => trainer.id == id);

    if (index === -1) {
      return null; // No se encontró el entrenador
    }

    // Eliminar el entrenador de la lista
    const deletedTrainer = trainersData.splice(index, 1)[0];

    return deletedTrainer;
  } catch (error) {
    throw error; // Propaga el error para manejarlo en el controlador
  }
};







/*
const db = require('../../trainers_app/db/db.js');

// Obtener todos los entrenadores
exports.getTrainers = async () => {
  try {
    return await db.any('SELECT * FROM trainers');
  } catch (error) {
    throw error;
  }
};

// Obtener un entrenador por ID
exports.getTrainerById = async (id) => {
  try {
    return await db.one('SELECT * FROM trainers WHERE id = $1', id);
  } catch (error) {
    throw error;
  }
};

// Agregar un nuevo entrenador
exports.addTrainer = async (newTrainer) => {
  try {
    const result = await db.one('INSERT INTO trainers(name) VALUES($1) RETURNING *', newTrainer.name);
    return result;
  } catch (error) {
    throw error;
  }
};

// Actualizar un entrenador
exports.updateTrainer = async (id, updatedTrainer) => {
  try {
    const result = await db.one('UPDATE trainers SET name = $1 WHERE id = $2 RETURNING *', [updatedTrainer.name, id]);
    return result;
  } catch (error) {
    throw error;
  }
};

// Eliminar un entrenador
exports.deleteTrainer = async (id) => {
  try {
    const result = await db.one('DELETE FROM trainers WHERE id = $1 RETURNING *', id);
    return result;
  } catch (error) {
    throw error;
  }
};*/
