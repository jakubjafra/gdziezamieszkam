(function(){
    let itemsLimit = new ReactiveVar(10);

    Template.offersMine.onCreated(function(){
        this.autorun(() => {
            this.subscribe("offers-mine", Sorting.constructQuery(sorting.get()), itemsLimit.get());
        });
    });

    Template.offersMine.helpers({
        'offers': () => Offers.find({})
    });

    Template.offersMine.events({
        'click #loadMore': function(){
            itemsLimit.set(itemsLimit.get() + 10);
        }
    });
})();