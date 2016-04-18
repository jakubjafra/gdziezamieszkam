Router.configure({
    layoutTemplate: 'appLayout'
});

Router.route('/', function(){
    this.render("offersList");
}, {name: 'offersList'});

Router.route('/mine', function(){
    this.render("offersMine");
}, {name: 'offersMine'});