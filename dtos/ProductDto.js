module.exports = class ProductDto {
    id;
    title;
    price;
    price_1;
    price_3;
    bonus;
    bonus_1;
    bonus_3;
    discount;
    description;
    image;
    mode;
    expiry;
    TagId;
    Tag;
    proiority;
    created_at;

    constructor(model) {
        this.id = model.id;
        this.title = model.title;
        this.price = model.price;
        this.price_1 = model.price_1;
        this.price_3 = model.price_3;
        this.bonus = model.bonus;
        this.bonus_1 = model.bonus_1;
        this.bonus_3 = model.bonus_3;
        this.rcon = model.rcon;
        this.rcon_1 = model.rcon_1;
        this.rcon_3 = model.rcon_3;
        this.proiority = model.proiority;
        this.rcon_forever = model.rcon_forever;
        this.discount = model.discount;
        this.description = model.description;
        this.image = model.image;
        this.mode = model.mode;
        this.expiry = model.expiry;
        this.TagId = model.TagId;
        this.Tag = model.Tag;
        this.createdAt = model.createdAt;
    }
}