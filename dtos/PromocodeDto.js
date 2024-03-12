module.exports = class PromocodeDto {
    id;
    name;
    amount;
    count;
    created_at;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.amount = model.amount;
        this.count = model.count;
        this.created_at = model.created_at;
    }
}