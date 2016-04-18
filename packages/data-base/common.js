Offers = new Mongo.Collection("offers");
Offers.permit('update').ifLoggedIn().allowInClientCode();