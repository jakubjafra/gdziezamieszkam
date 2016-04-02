Meteor.publish("offers", function(limit){
    return Offers.find({
        $and: [
            { 'lastSeen.0': { $gte: moment().startOf('day').subtract(1, 'days').valueOf() } },
            { 'address.city': "Poznań" }
        ]
    }, {
        limit: limit
    });
});

Meteor.publish("markers", function(){
    return Offers.find({
        $and: [
            { 'lastSeen.0': { $gte: moment().startOf('day').subtract(1, 'days').valueOf() } },
            { $or: [
                { 'address.street': { $ne: null } },
                { 'address.housing': { $ne: null } },
                { 'address.district': { $ne: null } }
            ]},
            { 'address.city': "Poznań" }
        ]
    }, {
        fields: {
            'cords': 1
        }
    });
})