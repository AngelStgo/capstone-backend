import express from 'express';
import Appointment from '../models/Appointment.js'

export const appointmentRouter = express.Router();


// GET /api/appointment return all appointments
appointmentRouter.get('/', async (req, res) => {
    try {
        const appointment = await Appointment.find();
        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// GET /api/appointment/:id return appointment by id
appointmentRouter.get("/:id", async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).send("Appointment not found");
        }
        res.json(appointment)
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
});


// POST /api/appointment create a new appointment
appointmentRouter.post("/", async (req, res) => {
    try {
      const { name, email, phone, artist, date, time, serviceType } = req.body;
      const newAppointment = new Appointment({ name, email, phone, artist, date, time, serviceType });
      await newAppointment.save();
      res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error booking appointment" });
    }
  });


// DELETE /api/appointment/:id delete appointment by the id
appointmentRouter.delete("/:id", async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

        if(!deletedAppointment) {
            return res.status(404).send("Appointment not found");
        }

        res.status(204).send("Appointment deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

//! PATCH need to be added