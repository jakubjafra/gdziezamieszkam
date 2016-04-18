(function(){
    let itemsLimit = new ReactiveVar(10);

    Template.offersMine.onCreated(function(){
        this.autorun(() => {
            this.subscribe("offers-mine", itemsLimit.get());
        });
    });

    Template.offersMine.helpers({
        'offers': () => Offers.find({}, {
            sort: {
                quality: -1,
                price: 1
            }
        })
    });

    Template.offersMine.events({
        'click #loadMore': function(){
            itemsLimit.set(itemsLimit.get() + 10);
        }
    });
})();