App.searchController = Ember.ArrayController.create({

    isSearching: false,

    currentPage: 0,

    total_results: 0,

    current_query: '',

    query: '',

  contract: function() {
    this.set('isExpanded', false);
  },

    setCurrentQuery: function(query) {
        this.current_query=query;
    },

    getCurrentQuery: function() {
        return this.current_query;
    },

    parseSolrResponse: function(response) {
        var results = {};
        this.total_results = response.response.numFound;
        $.each(response.response.docs, function(i, doc) {
            var result = {};
            var id = doc.id;
            result["uri"] = doc.cw_uri[0];
            result["label"] = doc.prefLabel[0];
            result["biotrans"] = doc.db_biotran[0];
            result["description"] = doc.db_description[0];
            results[id] = result;
        });
        return results;
    },

    resetPageCount: function(query) {
        this.total_results = 0;
        this.currentPage = 0;
        //this.search(query);
        this.set('query', query);
        this.conceptWikiSearch(query);
        App.Router.router.transitionTo('search');
    },

    search: function(query) {
        var me = this;
        var q = query;
        //only search if there are more results than currently shown
        if (me.total_results > me.currentPage * 10 || me.currentPage == 0) {
        this.set('isSearching', true);
        this.set('content', []);

        var solr_search = $.ajax({
            dataType: "jsonp",
            // will not be localhost on deployment, actual url required
            url: "http://localhost:8080/solr/select?json.wrf=?",
            cache: true,
            data: {
                q: "prefLabel:" + q + " OR db_biotran:" + q + " OR db_description:" + q,
                wt: "json",
                rows: 10,
                start: me.currentPage * 10
            }
        });

        solr_search.success(function (data) {
            me.currentPage++;
            var search_results = me.parseSolrResponse(data);
            $.each(search_results, function(i, search_result){
            var compound_query = $.ajax({
                dataType: "jsonp",
                url: compound_info_search_url,
                cache: true,
                data: {
                    _format: "json",
                    uri: search_result["uri"]
                }
            });
                            compound_query.success(function (data) {
                    var drugbankData, cs_uri, smiles;
                    var cw_uri = data.result.primaryTopic["_about"];
                    var id = cw_uri.split("/").pop();
                    $.each(data.result.primaryTopic.exactMatch, function (i, exactMatch) {
                        if (exactMatch["_about"]) {
                            if (exactMatch["_about"].indexOf("http://www4.wiwiss.fu-berlin.de/drugbank") !== -1) {
                                drugbankData = exactMatch;
                            } else if(exactMatch["_about"].indexOf("http://linkedlifedata.com/resource/drugbank") !== -1) {
                                drugbankData = exactMatch;
                            } else if (exactMatch["_about"].indexOf("http://www.chemspider.com") !== -1) {
                                cs_uri = exactMatch["_about"];
                                smiles = exactMatch.smiles;
                            } else if (exactMatch["_about"].indexOf("http://rdf.chemspider.com") !== -1) {
                                cs_uri = exactMatch["_about"];
                                smiles = exactMatch.smiles;
                            }
                        }
                    });
                    this_compound = App.Compound.createRecord({
                        id: id,
                        cw_uri: cw_uri,
                        description: drugbankData ? drugbankData.description : null,
                        biotransformation_item: drugbankData ? drugbankData.biotransformation : null,
                        toxicity: drugbankData ? drugbankData.toxicity : null,
                        protein_binding: drugbankData ? drugbankData.proteinBinding : null,
                        compound_pref_label: data.result.primaryTopic.prefLabel,
                        exactMatch: data.result.primaryTopic.prefLabel.toLowerCase() === q.toLowerCase() ? true : false,
                        cs_uri: cs_uri,
                        compound_smiles: smiles
                    });
                    if (data.result.primaryTopic.prefLabel.toLowerCase() === q.toLowerCase()) {
                        App.compoundsController.addExactMatch(this_compound);
                    } else {
                        App.compoundsController.addCompound(this_compound);
                    }
                });
            });
            me.set('isSearching', false);
            pageScrolling = false;
            enable_scroll();
        });
        } else {
            // always enable the scroll before returning
            pageScrolling = false;
            enable_scroll();
        }
    },

    conceptWikiSearch: function(query) {
        var me = this;
        var q = query;

        this.set('isSearching', true);
        this.set('content', []);
        var searcher = new Openphacts.ConceptWikiSearch(ldaBaseUrl); 
        var callback=function(success, status, response){
            if(success) {
                var results = searcher.parseResponse(response);
                $.each(results, function(index, compoundURI) {
                    var compoundSearcher = new Openphacts.CompoundSearch(ldaBaseUrl);  
                    var compoundCallback=function(success, status, response){
                        var compound = compoundSearcher.parseCompoundResponse(response); 
                        compound.prefLabel.toLowerCase() === q.toLowerCase() ? compound['exactMatch'] = true : compound['exactMatch'] = false;
                        this_compound = App.Compound.createRecord(compound);
                        if (this_compound.get('prefLabel').toLowerCase() === q.toLowerCase()) {
                            App.compoundsController.addExactMatch(this_compound);
                        } else {
                           App.compoundsController.addCompound(this_compound);
                        }
                    };    
                    compoundSearcher.fetchCompound(appID, appKey, compoundURI, compoundCallback);
                });
            } else {
                // an error in the response, ignore for now
            }
            me.set('isSearching', false);
            pageScrolling = false;
            enable_scroll();
        };  
        searcher.byTag(appID, appKey, 'Aspirin', '20', '4', '07a84994-e464-4bbf-812a-a4b96fa3d197', callback);
   }
});
