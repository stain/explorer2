App.Disease = DS.Model.extend({
    target: DS.belongsTo('searchResult'),
    name: DS.attr('string'),
    URI: DS.attr('string'),
    diseaseClass: DS.attr(),
    targets: DS.hasMany('target', {
        async: true
    }),
    hasDiseaseClasses: function() {
        return this.get('diseaseClass').length > 0;
    }.property('diseaseClass'),


});
