Offers = new Mongo.Collection("offers");
Offers.permit('update').ifLoggedIn().allowInClientCode();

Offers.attachSchema(new SimpleSchema({
    url: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        optional: true,
        index: 1
    },
    description: {
        type: String,
        optional: true
    },
    price: {
        type: Number,
        optional: true,
        index: 1
    },
    pictures: {
        type: [String],
        optional: true
    },
    address: {
        type: new SimpleSchema({
            street: {
                type: String,
                optional: true,
                index: 1
            },
            housing: {
                type: String,
                optional: true,
                index: 1
            },
            district: {
                type: String,
                optional: true,
                index: 1
            },
            city: {
                type: String,
                optional: true,
                index: 1
            }
        })
    },
    cords: {
        type: new SimpleSchema({
            lat: {
                type: String,
                optional: true
            },
            lng: {
                type: String,
                optional: true
            }
        })
    },
    cordsImportance: {
        type: Number,
        optional: true,
        index: 1
    },
    vendorType: {
        type: Number,
        optional: true,
        index: 1
    },
    area: {
        type: Number,
        optional: true,
        index: 1
    },
    roomCount: {
        type: Number,
        optional: true,
        index: 1
    },
    lastSeen: {
        type: [Number],
        optional: true,
        index: 1
    },
    pricePerArea: {
        type: Number,
        decimal: true,
        optional: true,
        index: 1
    },
    region: {
        type: Number,
        optional: true,
        index: 1
    },
    quality: {
        type: Number,
        decimal: true,
        optional: true,
        index: 1
    },
    users: {
        type: new SimpleSchema({
            accepted: {
                type: [String],
                optional: true,
                index: 1
            },
            declined: {
                type: [String],
                optional: true,
                index: 1
            }
        })
    }
}));