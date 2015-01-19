App.CompoundPharmacology = DS.Model.extend({
    compound: DS.belongsTo('compound'),
    compoundInchikey: DS.attr('string'),
    compoundDrugType: DS.attr('string'),
    compoundGenericName: DS.attr('string'),
    targets: DS.attr(),
    compoundInchikeySrc: DS.attr('string'),
    compoundDrugTypeSrc: DS.attr('string'),
    compoundGenericNameSrc: DS.attr('string'),
    targetTitleSrc: DS.attr('string'),
    chemblActivityUri: DS.attr('string'),
    chemblCompoundUri: DS.attr('string'),
    compoundFullMwt: DS.attr('string'),
    cwCompoundUri: DS.attr('string'),
    compoundPrefLabel: DS.attr('string'),
    csCompoundUri: DS.attr('string'),
    csid: DS.attr('string'),
    compoundInchi: DS.attr('string'),
    compoundSmiles: DS.attr('string'),
    chemblAssayUri: DS.attr('string'),
    targetOrganisms: DS.attr(),
    assayOrganism: DS.attr('string'),
    assayDescription: DS.attr('string'),
    activityRelation: DS.attr('string'),
    activityStandardUnits: DS.attr('string'),
    activityStandardValue: DS.attr('string'),
    activityActivityType: DS.attr('string'),
    compoundFullMwtSrc: DS.attr('string'),
    compoundPrefLabelSrc: DS.attr('string'),
    compoundInchiSrc: DS.attr('string'),
    compoundSmilesSrc: DS.attr('string'),
    targetOrganismSrc: DS.attr('string'),
    assayOrganismSrc: DS.attr('string'),
    assayDescriptionSrc: DS.attr('string'),
    activityRelationSrc: DS.attr('string'),
    activityStandardUnitsSrc: DS.attr('string'),
    activityStandardValueSrc: DS.attr('string'),
    activityActivityTypeSrc: DS.attr('string'),
    activityPubmedId: DS.attr('number'),
    assayDescriptionItem: DS.attr('string'),
    assayOrganismItem: DS.attr('string'),
    activityActivityTypeItem: DS.attr('string'),
    activityRelationItem: DS.attr('string'),
    activityStandardValueItem: DS.attr('string'),
    activityStandardUnitsItem: DS.attr('string'),
    activityValue: DS.attr('string'),
    compoundFullMwtItem: DS.attr('string'),
    compoundSmilesItem: DS.attr('string'),
    compoundInchiItem: DS.attr('string'),
    compoundInchikeyItem: DS.attr('string'),
    compoundPrefLabelItem: DS.attr('string'),
    pChembl: DS.attr('string'),
    chemblProvenance: DS.attr(),

    toString: function() {
	    //TODO should be this.get('fffff')
        return this.compoundInchiKey + this.compoundDrugType + this.compoundGenericName + this.targets + this.compoundInchikeySrc + this.compoundDrugTypeSrc + this.compoundGenericNameSrc + this.targetTitleSrc + this.chemblActivityUri + this.chemblCompoundUri + this.compoundFullMwt + this.cwCompoundUri + this.compoundPrefLabel + this.csCompoundUri + this.csid + this.compoundInchi + this.compoundSmiles + this.chemblAssayUri + this.targetOrganisms + this.assayOrganism + this.assayDescription + this.activityRelation + this.activityStandardUnits + this.activityStandardValue + this.activityActivityType + this.compoundFullMwtSrc + this.compoundPrefLabelSrc + this.compoundInchiSrc + this.compoundSmilesSrc + this.targetOrganismSrc + this.assayOrganismSrc;
    }

});
