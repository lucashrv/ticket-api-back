const { tickets } = require('../models')

module.exports = class ticketController {
    async store(req, res) {
        try {
            let ticket_code = await tickets.findOne({
                attributes: ['ticket_pass'],
                order: [['ticket_pass', 'DESC']],
                raw: true
            })

            const ticket_pass = !ticket_code ? 1 : ~~ticket_code.ticket_pass + 1;

            const data = {
                ...req.body,
                ticket_pass
            }

            const response = await tickets.create(data)

            res.json(response);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }

    async index(req, res) {
        try {
            const response = await tickets.findOne({
                order: [['type', 'DESC'], ['created_at', 'ASC']]
            })

            res.json(response);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }

    async listAll(req, res) {
        try {
            const response = await tickets.findAll({
                order: [['type', 'DESC'], ['created_at', 'ASC']]
            })

            res.json(response);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }

    async call(req, res) {
        try {
            const patient = await tickets.findOne({
                order: [['type', 'DESC'], ['created_at', 'ASC']],
                attributes: ['id']
            })

            if (!patient) {
                res.json('Não tem mais pacientes na fila');
                return
            }

            await tickets.destroy({
                where: {
                    id: patient.id
                }
            })

            const response = await tickets.findOne({
                order: [['type', 'DESC'], ['created_at', 'ASC']]
            })

            const nextPatient = response ? response : 'Não tem mais pacientes na fila'

            res.json(nextPatient);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }
}