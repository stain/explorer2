App.Target = App.SearchResult.extend({
    prefLabel: DS.attr('string'),
    exactMatch: DS.attr('boolean'),
    cellularLocation: DS.attr('string'),
    molecularWeight: DS.attr('string'),
    numberOfResidues: DS.attr('string'),
    theoreticalPi: DS.attr('string'),
    drugbankURI: DS.attr('string'),
    description: DS.attr('string'),
    subClassOf: DS.attr('string'),
    keywords: DS.attr(),
    functionAnnotation: DS.attr('string'),
    alternativeName: DS.attr('string'),
    existence: DS.attr('string'),
    organism: DS.attr('string'),
    sequence: DS.attr('string'),
    classifiedWith: DS.attr(),
    seeAlso: DS.attr(),
    pharmacology: DS.hasMany('TargetPharmacology'),
    isCompound: false,
    URI: DS.attr('string'),
    // provenance
    chemblProvenance: DS.attr(),
    drugbankProvenance: DS.attr(),
    uniprotProvenance: DS.attr(),
    conceptwikiProvenance: DS.attr(),

    pathways: DS.hasMany('pathway', { async: true }),
    pathwayRecords: DS.attr('number'),

    pathwayInfoAvailable: function() {
        return (this.get('pathwayRecords') !== null && this.get('pathwayRecords') >= 0);
    }.property('pathwayRecords'),

    hasPathways: function() {
        return this.get('pathwayRecords') > 0;
    }.property('pathwayRecords')
});
