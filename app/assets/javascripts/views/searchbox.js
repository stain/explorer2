App.SearchBox = Em.TextField.extend({
	
    classNames:["search-query"],

    insertNewline: function() {
      var query = this.get('value');
      // remove all current results before searching
      App.compoundsController.set('content', []);
      App.searchController.setCurrentQuery(query);
      // it is a new query so reset all the pagination and result details
      App.searchController.resetPageCount(query);
    }

  });
