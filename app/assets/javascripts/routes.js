// If you want your urls to look www.yourapp.org/x instead of www.yourapp.org/#/x
// you have to set location to 'history'. This means that you must also tell rails
// what your routes are and to redirect them to whatever template contains the ember
// outlet
App.Router.reopen({
  location: 'history',
  rootURL: '/'
});

App.Router.map(function() { 
    this.route("search", { path: "/search" });
    this.resource('compounds'); 
    this.resource('compound', { path: '/compound/:compound_id' });
});

App.CompoundRoute = Ember.Route.extend({
  setupController: function(controller, compound) {
    console.log('compound controller');
    controller.set('content', compound);
  },
  model: function(params) {
    compound = App.Compound.find(params.compound_id);
    return compound;
  }
});
App.IndexRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    App.searchController.set('query', '');
  }
});