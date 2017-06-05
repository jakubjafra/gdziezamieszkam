Subscriptions = new Mongo.Collection("subscriptions");
Subscriptions.permit('insert').allowInClientCode();