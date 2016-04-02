Router.route('/', function(){
    this.render("index");
}, {name: 'offers'});

Router.route('/map', function(){
    this.render("map");
});