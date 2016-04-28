Router.configure({
    layoutTemplate: 'appLayout'
});

Router.route('/', function(){
    this.render("index");
}, { name: 'index', layoutTemplate: null });

Router.route('/mieszkania/poznan/', function(){
    this.render("offersList");
}, {name: 'offersList'});

Router.route('/mieszkania/poznan/moje', function(){
    this.render("offersMine");
}, {name: 'offersMine'});