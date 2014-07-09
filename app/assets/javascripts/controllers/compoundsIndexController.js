App.CompoundsIndexController = Ember.ObjectController.extend({

  needs: ['application'],

  queryParams: ['uri'],
  uri: '',

  showProvenance: false,

  hasPathways: function() {
      if(this.get('model.pathwayRecords') != null && this.get('model.pathwayRecords') > 0) {
        return true;
      }
  }.property('model.pathwayRecords'),

  hasPharmacology: function() {
      if(this.get('model.pharmacologyRecords') != null && this.get('model.pharmacologyRecords') > 0) {
        return true;
      }
  }.property('model.pharmacologyRecords'),

  actions: {
  	  enableProvenance: function() {
    	this.set('showProvenance', true);
    	console.log("Compund provenance enabled");
	  },

  	  disableProvenance: function() {
      	this.set('showProvenance', false);
    	console.log("Compound provenance disabled");
  	  }
  }
	
});
