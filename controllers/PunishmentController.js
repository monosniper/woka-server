const {connection} = require("../db");

class PunishmentController {
    async getAll(req, res, next) {
        try {
            let bans = []
            let mutes = []
            let kicks = []
            let names = {}

            const mapNames = (rows) => {
                return rows.map(row => {
                    row.name = names.find(({uuid}) => uuid === row.uuid).name
                    return row
                })
            }

            return connection.query('SELECT * FROM litebans_history', (err, rows, fields) => {
                if (err) throw err

                names = rows

                return connection.query('SELECT * FROM litebans_bans ORDER BY time DESC', (err, rows, fields) => {
                    if (err) throw err

                    bans = mapNames(rows)

                    return connection.query('SELECT * FROM litebans_mutes ORDER BY time DESC', (err, rows, fields) => {
                        if (err) throw err

                        mutes = mapNames(rows)

                        return connection.query('SELECT * FROM litebans_kicks ORDER BY time DESC', (err, rows, fields) => {
                            if (err) throw err

                            kicks = mapNames(rows)

                            return res.json({
                                bans,
                                mutes,
                                kicks,
                            });
                        })
                    })
                })
            })
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PunishmentController();