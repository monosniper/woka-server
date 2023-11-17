module.exports = class ProductDto {
    id;
    title;
    price;
    description;
    image;
    expiry;
    TagId;
    created_at;

    constructor(model) {
	this.id = model.id;
	this.title = model.title;
	this.price = model.price;
	this.description = model.description;
	this.image = model.image;
	this.expiry = model.expiry;
	this.TagId = model.TagId;
	this.createdAt = model.createdAt;
    }
}