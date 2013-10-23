App.CompoundPharmacologyIndexController = Ember.ArrayController.extend({

  needs: "compound",

  page: null,

  currentCount: function() {
    return this.get('model.content.length');
  }.property('model.content.length'),

  totalCount: null,

  navigateTo: function(target) {
    var me = this;
    console.log(target.about);
    var searcher = new Openphacts.TargetSearch(ldaBaseUrl, appID, appKey);
    var this_target = App.Target.createRecord();  
    var callback=function(success, status, response){
        if (success) {
            var targetResult = searcher.parseTargetResponse(response);
            this_target.setProperties(targetResult);
            me.target.transitionTo('target', this_target);
        } else {
            alert("Could not find information about " + target.title);
        }
    };  
    searcher.fetchTarget(target.about, callback);
  },

  tsvDownload: function(compound) {
    var me = this;
    console.log("Create TSV file");
	var tsvCreateRequest = $.ajax({
		url: tsvCreateUrl,
        dataType: 'json',
		cache: true,
		data: {
			_format: "json",
			uri: compound.id,
            total_count: me.totalCount
		},
		success: function(response, status, request) {
			console.log('tsv create request success');
		},
		error: function(request, status, error) {
			console.log('tsv create request success');
		}
	});

  }

});

App.CompoundPharmacologyIndexController.reopen({
 
  fetchMore: function() {
    if (this.get('model.content.length') < this.totalCount) {
    var me = this;
    var thisCompound = this.get('controllers.compound').get('content');
    var searcher = new Openphacts.CompoundSearch(ldaBaseUrl, appID, appKey);
    var pharmaCallback=function(success, status, response){
      if (success && response) {
        me.page++;
        var pharmaResults = searcher.parseCompoundPharmacologyResponse(response);
        $.each(pharmaResults, function(index, pharma) {
          var pharmaRecord = me.store.createRecord('compoundPharmacology', pharma);
	      thisCompound.get('pharmacology').pushObject(pharmaRecord);
        });
      pageScrolling = false;
      enable_scroll();
      }
    };
    searcher.compoundPharmacology('http://www.conceptwiki.org/concept/' + thisCompound.id, this.page + 1, 50, pharmaCallback);
    }
    pageScrolling = false;
    enable_scroll();
  }

});
