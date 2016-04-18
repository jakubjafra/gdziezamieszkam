(function(){
    Template.menu.onCreated(function(){
        let instance = Template.instance();
        instance.subscribe("offers-counts");
    });
})();