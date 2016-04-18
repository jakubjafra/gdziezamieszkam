Template.offer.helpers({
    'firstPicture': function(){
        return this.pictures[0];
    },
    'niceAddress': function(address){
        let string = "";

        if(address.street !== null)
            string += "ul. " + address.street;

        if(address.housing !== null)
            string += (string.length > 0 ? ", " : "") + "os. " + address.housing;

        if(address.district !== null)
            string += (string.length > 0 ? ", " : "") + address.district;

        if(string.length === 0)
            string = address.city;

        return string;
    },
    'niceRoomCount': function(count){
        switch(count){
            case 1:
                return "Kawalerka";

            case 2:
            case 3:
            case 4:
                return `${count} pokoje`;

            default:
                return `${count} pokoi`;
        }
    }
});

Template.offer.events({
    'click .accept': function(){
        if(Meteor.userId() === null)
            return;

        Offers.update(this._id, {
            $push: { 'users.accepted': Meteor.userId() }
        });
    },
    'click .decline': function(){
        if(Meteor.userId() === null)
            return;

        Offers.update(this._id, {
            $push: { 'users.declined': Meteor.userId() }
        });
    }
})