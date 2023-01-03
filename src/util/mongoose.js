module.exports = {
    toObjectMongoose: function (mongooses) {
        return mongooses.map((mongoose) => mongoose.toObject());
    },
};
