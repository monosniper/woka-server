const Tag = require("../models/tag");

class TagService {
    async getAll(options) {
        return Tag.findAll(options);
    }

    async getOne(id) {
        return Tag.findByPk(id);
    }

    async create(data) {
        return Tag.create(data);
    }

    async delete(id) {
        return Tag.destroy({where: {id}});
    }

    async update(id, data) {
        await Tag.update(data, {
            where: {id}, fields: [
                'name',
                'icon',
                'isPrivilege',
                'isAlone',
                'isHidden',
            ]
        });

        return Tag.findByPk(id);
    }
}

module.exports = new TagService();