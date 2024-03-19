module.exports = class BuyDto {
    id;
    name;
    amount;
    promo;
    Products;
    ProductIds;
    isCompleted;
    created_at;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.amount = model.amount;
        this.promo = model.promo;
        this.Products = model.Products;
        this.ProductIds = model.Products.map(({id}) => id);
        this.isCompleted = model.isCompleted;
        this.created_at = model.createdAt;
    }
}