const { tickets } = require('../models')
const { Op } = require('Sequelize')
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

            if (await tickets.count() <= 1) {
                await tickets.update({
                    is_calling: true
                }, {
                    where: {
                        id: response.id
                    }
                })

                response.is_calling = true;
            }

            res.json(response);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }

    async index(req, res) {
        try {
            const response = await tickets.findOne({
                where: {
                    is_calling: true
                },
                order: [['is_calling', 'DESC'], ['type', 'DESC'], ['created_at', 'ASC']]
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
                order: [['type', 'DESC'], ['created_at', 'ASC']],
                raw: true
            })

            const orderCall = [response[1].type];

            if (response[0].type === 2) {
                orderCall.push(2);
            }

            const whereOptions = {
                type: {
                    [Op.notIn]: orderCall
                }
            }
            const nextPatient = await tickets.findOne({
                order: [['type', 'DESC'], ['created_at', 'ASC']],
                where: whereOptions,
                raw: true
            })

            res.json(response);
        } catch (error) {
            console.log(error)

            res.status(500).send(error)
        }
    }

    async call(req, res) {
        try {
            const patients = await tickets.findAll({
                order: [['is_calling', 'DESC'], ['type', 'DESC'], ['created_at', 'ASC']],
                raw: true
            })

            if (!patients.length) {
                res.json('Não tem mais pacientes na fila');
                return
            }

            const orderCall = patients[0].type === 3 && patients[1].type === 3 ? [patients[1].type] : [];

            if (patients[0].type === 2 && patients[1].type === 2) {
                orderCall.push(2);
            }

            const whereOptions = {
                type: {
                    [Op.notIn]: orderCall
                },
                id: {
                    [Op.ne]: patients[0].id
                }
            }

            if (patients.length >= 2) {
                whereOptions.is_calling = false;
            }

            const nextPatient = await tickets.findOne({
                order: [['type', 'DESC'], ['created_at', 'ASC']],
                where: whereOptions,
                raw: true
            })

            if (!nextPatient) {
                tickets.destroy({
                    where: {
                        id: patients[0].id
                    }
                })
                res.json('Não tem mais pacientes na fila');
                return
            } else {
                const promiseList = [
                    tickets.update({
                        is_calling: true
                        }, {
                        where: {
                            id: nextPatient.id
                        }
                    }),
                    tickets.destroy({
                        where: {
                            id: patients[0].id
                        }
                    })
                ]

                await Promise.all(promiseList)
                res.json(nextPatient);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
}