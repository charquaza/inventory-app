var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        description: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        price: { type: Number, required: true, min: 0, max: 1000000 },
        number_in_stock: { type: Number, required: true, min: 0, max: 99 }
    }
);

ItemSchema.virtual('url')
    .get(function () {
        return '/catalog/item/' + this._id;
    });

module.exports = mongoose.model('Item', ItemSchema);