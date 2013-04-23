var Openphacts = Openphacts || {};
Openphacts.CompoundSearch = function CompoundSearch(baseURL) {
	this.baseURL = baseURL;
}

Openphacts.CompoundSearch.prototype.fetchCompound = function(appID, appKey, compoundUri, callback) {
	var compoundQuery = $.ajax({
		url: this.baseURL + '/compound',
		cache: true,
		data: {
			_format: "json",
			uri: compoundUri,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.CompoundSearch.prototype.compoundPharmacology = function(appID, appKey, compoundUri, page, pageSize, callback) {
	var compoundQuery = $.ajax({
		url: this.baseURL + '/compound/pharmacology/pages',
		cache: true,
		data: {
			_format: "json",
			_page: page,
			_pageSize: pageSize,
			uri: compoundUri,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.CompoundSearch.prototype.parseCompoundResponse = function(response) {
	var drugbankData, chemspiderData, chemblData;
	var cwUri = response["_about"];
	var id = cwUri.split("/").pop();
	var prefLabel = response.prefLabel;
	$.each(response.exactMatch, function(i, exactMatch) {
		if (exactMatch["_about"]) {
			if (exactMatch["_about"].indexOf("http://www4.wiwiss.fu-berlin.de/drugbank") !== -1) {
				drugbankData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://linkedlifedata.com/resource/drugbank") !== -1) {
				drugbankData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://www.chemspider.com") !== -1) {
				chemspiderData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://rdf.chemspider.com") !== -1) {
				chemspiderData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://data.kasabi.com/dataset/chembl-rdf") !== -1) {
				chemblData = exactMatch;
			}
		}
	});
	return {
		id: id,
		prefLabel: prefLabel,
		cwUri: cwUri,
		description: drugbankData ? drugbankData.description : null,
		biotransformationItem: drugbankData ? drugbankData.biotransformation : null,
		toxicity: drugbankData ? drugbankData.toxicity : null,
		proteinBinding: drugbankData ? drugbankData.proteinBinding : null,
		csUri: chemspiderData ? chemspiderData["_about"] : null,
		hba: chemspiderData ? chemspiderData.hba : null,
		hbd: chemspiderData ? chemspiderData.hbd : null,
		inchi: chemspiderData ? chemspiderData.inchi : null,
		logp: chemspiderData ? chemspiderData.logp : null,
		psa: chemspiderData ? chemspiderData.psa : null,
		ro5Violations: chemspiderData ? chemspiderData.ro5_violations : null,
		smiles: chemspiderData ? chemspiderData.smiles : null,
		chemblURI: chemblData ? chemblData["_about"] : null,
		fullMWT: chemblData ? chemblData.full_mwt : null,
		molform: chemblData ? chemblData.molform : null,
		mwFreebase: chemblData ? chemblData.mw_freebase : null,
		rtb: chemblData ? chemblData.rtb : null
	};
}

Openphacts.CompoundSearch.prototype.parseCompoundPharmacologyResponse = function(response) {
	var records = [];

	$.each(response.items, function(i, item) {

		var chembl_activity_uri = item["_about"];
		var chembl_src = item["_inDataset"];
		var activity_pubmed_id = item['pmid'];
		var activity_relation = item['relation'];
		var activity_standard_units = item['standardUnits'];
		var activity_standard_value = item['standardValue'];
		var activity_activity_type = item['activity_type'];

		var compound_full_mwt_item;

		//big bits
		var forMolecule = item["forMolecule"];
		var chembleMolecultLink = 'https://www.ebi.ac.uk/chembldb/compound/inspect/';
		if (forMolecule != null) {
			var chembl_compound_uri = forMolecule["_about"];
			var compound_full_mwt = forMolecule['full_mwt'];
			chembleMolecultLink += chembl_compound_uri.split('/').pop();
			compound_full_mwt_item = chembleMolecultLink;
			var em = forMolecule["exactMatch"];
		}

		var cw_compound_uri, compound_pref_label, cw_src, cs_compound_uri, compound_inchi, compound_inchikey, compound_smiles, cs_src, drugbank_compound_uri, compound_drug_type, compound_generic_name, drugbank_src, csid, compound_smiles_item, compound_inchi_item, compound_inchikey_item, compound_pref_label_item;

		$.each(em, function(index, match) {
			var src = match["inDataset"];
			if (match["_about"].indexOf("http://www.conceptwiki.org") !== -1) {
				cw_compound_uri = match["_about"];
				compound_pref_label = match['prefLabel'];
				compound_pref_label_item = cw_compound_uri;
				cw_src = match["inDataset"];
			} else if (match["_about"].indexOf("chemspider.com") !== -1) {
				cs_compound_uri = match["_about"];
				csid = cs_compound_uri.split('/').pop();
				compound_inchi = match['inchi'];
				compound_inchikey = match['inchikey'];
				compound_smiles = match['smiles'];
				var chemSpiderLink = 'http://www.chemspider.com/' + csid;
				compound_smiles_item = chemSpiderLink;
				compound_inchi_item = chemSpiderLink;
				compound_inchikey_item = chemSpiderLink;
				cs_src = match["inDataset"];
			} else if (match["_about"].indexOf("http://www4.wiwiss.fu-berlin.de/drugbank") !== -1) {
				drugbank_compound_uri = match["_about"];
				compound_drug_type = match['drugType'];
				compound_generic_name = match['genericName'];
				drugbank_src = match["_about"];
			} else if (match["_about"].indexOf("http://linkedlifedata.com/resource/drugbank") !== -1) {
				drugbank_compound_uri = match["_about"];
				compound_drug_type = match['drugType'];
				compound_generic_name = match['genericName'];
				drugbank_src = match["_about"];
			}
		});

		var target_title_item, target_organism_item, activity_activity_type_item, activity_standard_value_item, activity_standard_units_item, activity_relation_item, assay_description, assay_description_item, assay_organism, assay_organism_src, assay_organism_item;

		var onAssay = item["onAssay"];
		//console.log(" ITEM : " + onAssay["_about"]);
		if (onAssay != null) {
			var chembl_assay_uri = onAssay["_about"];
			var chembldAssayLink = 'https://www.ebi.ac.uk/chembldb/assay/inspect/';
			assay_description = onAssay['description'];
			var chembleAssayLink = chembldAssayLink + chembl_assay_uri.split('/').pop();
			assay_description_item = chembleAssayLink;
			assay_organism = onAssay['organism'];
			assay_organism_item = chembleAssayLink;

			var target = onAssay['target'];
			var targets = new Array();
			var target_organisms = new Array();

			$.each(target, function(index, target_item) {

				// For Target
				var target_inner = {};
				target_inner['title'] = target_item['title'] ? target_item['title'] : '';
				target_inner['src'] = onAssay["inDataset"] ? onAssay["inDataset"] : '';
				if (target_item["_about"]) {
					var targetLink = 'https://www.ebi.ac.uk/chembl/target/inspect/' + target_item["_about"].split('/').pop();
					target_inner['item'] = targetLink;
				} else {
					target_inner['item'] = '';
				}
				targets.push(target_inner);

				// For Organism
				var organism_inner = {};
				organism_inner['organism'] = target_item['organism'] ? target_item['organism'] : '';
				organism_inner['src'] = onAssay["inDataset"] ? onAssay["inDataset"] : '';
				if (target_item["_about"]) {
					var organismLink = 'https://www.ebi.ac.uk/chembl/target/inspect/' + target_item["_about"].split('/').pop();
					organism_inner['item'] = organismLink;
				} else {
					organism_inner['item'] = '';
				}
				target_organisms.push(organism_inner);
			});
		}

		var chemblActivityLink = 'https://www.ebi.ac.uk/ebisearch/crossrefsearch.ebi?id=' + chembl_activity_uri.split('/a').pop() + '&db=chembl-activity&ref=chembl-compound';

		//console.log(" chembl value " + chembl_activity_uri.split('/a').pop());
		activity_activity_type_item = chemblActivityLink;
		activity_standard_value_item = chemblActivityLink;
		activity_standard_units_item = chemblActivityLink;
		activity_relation_item = chemblActivityLink;
		records.push({
			//for compound
			compound_inchikey: compound_inchikey,
			compound_drug_type: compound_drug_type,
			compound_generic_name: compound_generic_name,
			targets: targets,
			compound_inchikey_src: cs_src,
			compound_drug_type_src: drugbank_src,
			compound_generic_name_src: drugbank_src,
			target_title_src: chembl_src,
			//for target
			chembl_activity_uri: chembl_activity_uri,
			chembl_compound_uri: chembl_compound_uri,
			compound_full_mwt: compound_full_mwt,
			cw_compound_uri: cw_compound_uri,
			compound_pref_label: compound_pref_label,
			cs_compound_uri: cs_compound_uri,
			csid: csid,
			compound_inchi: compound_inchi,
			compound_smiles: compound_smiles,
			chembl_assay_uri: chembl_assay_uri,
			target_organisms: target_organisms,
			assay_organism: assay_organism,
			assay_description: assay_description,
			activity_relation: activity_relation,
			activity_standard_units: activity_standard_units,
			activity_standard_value: activity_standard_value,
			activity_activity_type: activity_activity_type,

			compound_full_mwt_src: chembl_src,
			compound_pref_label_src: cw_src,
			compound_inchi_src: cs_src,
			compound_smiles_src: cs_src,
			target_organism_src: chembl_src,
			assay_organism_src: chembl_src,
			assay_description_src: chembl_src,
			activity_relation_src: chembl_src,
			activity_standard_units_src: chembl_src,
			activity_standard_value_src: chembl_src,
			activity_activity_type_src: chembl_src,
			activity_pubmed_id: activity_pubmed_id,
			assay_description_item: assay_description_item,
			assay_organism_item: assay_organism_item,
			activity_activity_type_item: activity_activity_type_item,
			activity_relation_item: activity_relation_item,
			activity_standard_value_item: activity_standard_value_item,
			activity_standard_units_item: activity_standard_units_item,
			compound_full_mwt_item: compound_full_mwt_item,
			compound_smiles_item: compound_smiles_item,
			compound_inchi_item: compound_inchi_item,
			compound_inchikey_item: compound_inchikey_item,
			compound_pref_label_item: compound_pref_label_item
		});
	});
	return records;
}
Openphacts.ConceptWikiSearch = function(baseURL) {
	this.baseURL = baseURL;
}

Openphacts.ConceptWikiSearch.prototype.byTag = function(appID, appKey, query, limit, branch, type, callback) {
	var conceptWikiSearcher = $.ajax({
		url: this.baseURL + "/search/byTag",
		cache: true,
		data: {
			q: query,
			limit: limit,
			branch: branch,
			uuid: type,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic.result);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.ConceptWikiSearch.prototype.findCompounds = function(appID, appKey, query, limit, branch, callback) {
	var conceptWikiSearcher = $.ajax({
		url: this.baseURL + "/search/byTag",
		cache: true,
		data: {
			q: query,
			limit: limit,
			branch: branch,
			uuid: '07a84994-e464-4bbf-812a-a4b96fa3d197',
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic.result);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.ConceptWikiSearch.prototype.findTargets = function(appID, appKey, query, limit, branch, callback) {
	var conceptWikiSearcher = $.ajax({
		url: this.baseURL + "/search/byTag",
		cache: true,
		data: {
			q: query,
			limit: limit,
			branch: branch,
			uuid: 'eeaec894-d856-4106-9fa1-662b1dc6c6f1',
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic.result);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.ConceptWikiSearch.prototype.parseResponse = function(response) {
	var uris = [];
	//response can be either array or singleton.
	if (response instanceof Array) {
		$.each(response, function(i, match) {
			uris.push({
				'uri': match["_about"],
				'prefLabel': match["prefLabel"],
				'match': match["match"]
			});
		});
	} else {
		uris.push({
			'uri': response["_about"],
			'prefLabel': response["prefLabel"],
			'match': response["match"]
		});
	}
	return uris;
}

Openphacts.ConceptWikiSearch.prototype.findConcept = function(appID, appKey, uuid, callback) {
	var conceptWikiSearcher = $.ajax({
		url: this.baseURL + "/getConceptDescription",
		cache: true,
		data: {
			uuid: uuid,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.ConceptWikiSearch.prototype.parseFindConceptResponse = function(response) {
	var prefLabel = response.prefLabel_en;
	var definition = response.definition;
	var altLabels = [];
	if (response.altLabel_en) {
		$.each(response.altLabel_en, function(index, altLabel) {
			altLabels.push(altLabel);
		});
	}
	return {
		prefLabel: prefLabel,
		definition: definition,
		altLabels: altLabels
	};
}
Openphacts.TargetSearch = function TargetSearch(baseURL) {
	this.baseURL = baseURL;
}

Openphacts.TargetSearch.prototype.fetchTarget = function(appID, appKey, targetUri, callback) {
	var targetQuery = $.ajax({
		url: this.baseURL + '/target',
		cache: true,
		data: {
			_format: "json",
			uri: targetUri,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result.primaryTopic);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.TargetSearch.prototype.targetPharmacology = function(appID, appKey, targetUri, page, pageSize, callback) {
	var targetQuery = $.ajax({
		url: this.baseURL + '/target/pharmacology/pages',
		cache: true,
		data: {
			_format: "json",
			_page: page,
			_pageSize: pageSize,
			uri: targetUri,
			app_id: appID,
			app_key: appKey
		},
		success: function(response, status, request) {
			callback.call(this, true, request.status, response.result);
		},
		error: function(request, status, error) {
			callback.call(this, false, request.status);
		}
	});
}

Openphacts.TargetSearch.prototype.parseTargetResponse = function(response) {
	var drugbankData, chemblData, uniprotData;
	var cwUri = response["_about"];
	var id = cwUri.split("/").pop();
	var keywords = [];
	var classifiedWith = [];
	var seeAlso = [];
	$.each(response.exactMatch, function(i, exactMatch) {
		if (exactMatch["_about"]) {
			if (exactMatch["_about"].indexOf("http://www4.wiwiss.fu-berlin.de/drugbank") !== -1) {
				drugbankData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://linkedlifedata.com/resource/drugbank") !== -1) {
				drugbankData = exactMatch;
			} else if (exactMatch["_about"].indexOf("http://data.kasabi.com/dataset/chembl-rdf") !== -1) {
				chemblData = exactMatch;
				$.each(chemblData.keyword, function(j, key) {
					keywords.push(key);
				});
			} else if (exactMatch["_about"].indexOf("http://purl.uniprot.org") !== -1) {
				uniprotData = exactMatch;
				if (uniprotData.classifiedWith) {
					$.each(uniprotData.classifiedWith, function(j, classified) {
						classifiedWith.push(classified);
					});
				}
				if (uniprotData.seeAlso) {
					$.each(uniprotData.seeAlso, function(j, see) {
						seeAlso.push(see);
					});
				}
			}
		}
	});
	return {
		id: id,
		cellularLocation: drugbankData ? drugbankData.cellularLocation : null,
		molecularWeight: drugbankData ? drugbankData.molecularWeight : null,
		numberOfResidues: drugbankData ? drugbankData.numberOfResidues : null,
		theoreticalPi: drugbankData ? drugbankData.theoreticalPi : null,
		drugbankURI: drugbankData ? drugbankData["_about"] : null,
		description: chemblData ? chemblData.description : null,
		subClassOf: chemblData ? chemblData.subClassOf : null,
		keywords: keywords,
		functionAnnotation: uniprotData ? uniprotData.Function_Annotation : null,
		alternativeName: uniprotData ? uniprotData.alternativeName : null,
		existence: uniprotData ? uniprotData.existence : null,
		organism: uniprotData ? uniprotData.organism : null,
		sequence: uniprotData ? uniprotData.sequence : null,
		classifiedWith: classifiedWith,
		seeAlso: seeAlso
	};
}

Openphacts.TargetSearch.prototype.parseTargetPharmacologyResponse = function(response) {
	var records = [];

	$.each(response.items, function(index, item) {
		var chembl_activity_uri = item["_about"];
		var chembl_src = item["inDataset"];

		//big bits
		var forMolecule = item["forMolecule"];
		var chembl_compound_uri;
		var compound_full_mwt;
		var compound_full_mwt_item;

		var em;
		var chembleMolecultLink = 'https://www.ebi.ac.uk/chembldb/compound/inspect/';

		if (forMolecule != null) {
			chembl_compound_uri = forMolecule["_about"];
			compound_full_mwt = forMolecule['full_mwt'];
			chembleMolecultLink += chembl_compound_uri.split('/').pop();
			compound_full_mwt_item = chembleMolecultLink;
			em = forMolecule["exactMatch"];
		}

		var cw_compound_uri, compound_pref_label, cw_src, cs_compound_uri, compound_inchi, compound_inchikey, compound_smiles, cs_src, drugbank_compound_uri, compound_drug_type, compound_generic_name, drugbank_src, csid, compound_pref_label_item, compound_inchi_item, compound_inchikey_item, compound_smiles_item, assay_description, assay_description_item;

		$.each(em, function(index, match) {
			var src = match["inDataset"];
			if (match["_about"].indexOf("http://www.conceptwiki.org") !== -1) {
				cw_compound_uri = match["_about"];
				compound_pref_label = match['prefLabel'];
				cw_src = match["inDataset"];
				compound_pref_label_item = cw_compound_uri;
			} else if (match["_about"].indexOf("chemspider.com") !== -1) {
				cs_compound_uri = match["_about"];
				csid = cs_compound_uri.split('/').pop();
				compound_inchi = match['inchi'];
				compound_inchikey = match['inchikey'];
				compound_smiles = match['smiles'];
				cs_src = match["inDataset"];
				var chemSpiderLink = 'http://www.chemspider.com/' + csid;
				compound_inchi_item = chemSpiderLink;
				compound_inchikey_item = chemSpiderLink;
				compound_smiles_item = chemSpiderLink;
			} else if (match["_about"].indexOf("http://www4.wiwiss.fu-berlin.de/drugbank") !== -1) {
				drugbank_compound_uri = match["_about"];
				compound_drug_type = match['drugType'];
				compound_generic_name = match['genericName'];
				drugbank_src = match["_about"];
			} else if (match["_about"].indexOf("http://linkedlifedata.com/resource/drugbank") !== -1) {
				drugbank_compound_uri = match["_about"];
				compound_drug_type = match['drugType'];
				compound_generic_name = match['genericName'];
				drugbank_src = match["_about"];
			}
		});

		var onAssay = item["onAssay"];
		var chembl_assay_uri;
		var assay_organism;
		var assay_organism_item;
		var target;
		var chembldAssayLink = 'https://www.ebi.ac.uk/chembldb/assay/inspect/';

		if (onAssay != null) {
			chembl_assay_uri = onAssay["_about"];
			assay_organism = onAssay['assay_organism'];
			assay_organism_item = chembldAssayLink + chembl_assay_uri.split('/').pop();
			assay_description = onAssay['description'];
			assay_description_item = chembldAssayLink + chembl_assay_uri.split('/').pop();
			target = onAssay['target'];
		}
		var chembl_target_uri;
		var target_pref_label;
		var target_pref_label_item;
		var targetMatch;
		var target_title;
		var target_organism;
		var target_organism_item;
		var target_concatenated_uris;
		var chemblTargetLink = 'https://www.ebi.ac.uk/chembldb/target/inspect/';
		var target_organisms = new Array();
		var targets = new Array();
		if (target != null) {
			chembl_target_uri = target["_about"];
			//target_pref_label = target['prefLabel'];
			targetMatch = target['exactMatch'];
			if (targetMatch != null) {
				var targetMatchURI = targetMatch["_about"];
				target_pref_label = targetMatch['prefLabel'];
				target_pref_label_item = targetMatchURI;
				target_title = target_pref_label;
			}

			target_organism = target['target_organism'];
			target_organism_item = chemblTargetLink + chembl_target_uri.split('/').pop();
			target_concatenated_uris = target['concatenatedURIs'];
			var target_organisms_inner = {};
			target_organisms_inner['organism'] = target_organism;
			target_organisms_inner['src'] = target_organism_item;
			target_organisms.push(target_organisms_inner);
			var targets_inner = {};
			targets_inner['title'] = target_pref_label;
			targets_inner['cw_uri'] = target_pref_label_item;
			targets.push(targets_inner);
		}

		var chemblActivityLink = 'https://www.ebi.ac.uk/ebisearch/crossrefsearch.ebi?id=' + chembl_activity_uri.split('/a').pop() + '&db=chembl-activity&ref=chembl-compound';

		var activity_activity_type_item, activity_standard_value_item, activity_standard_units_item, activity_relation_item;

		var activity_activity_type = item['activity_type'];
		activity_activity_type_item = chemblActivityLink;
		var activity_standard_value = item['standardValue'];
		activity_standard_value_item = chemblActivityLink;
		var activity_standard_units = item['standardUnits'];
		activity_standard_units_item = chemblActivityLink;
		var activity_relation = item['relation'];
		activity_relation_item = chemblActivityLink;
		var activity_pubmed_id = item['pmid'];
		records.push({ //for compound
			compound_inchikey: compound_inchikey,
			compound_drug_type: compound_drug_type,
			compound_generic_name: compound_generic_name,
			target_title: target_title,
			target_concatenated_uris: target_concatenated_uris,

			compound_inchikey_src: cs_src,
			compound_drug_type_src: drugbank_src,
			compound_generic_name_src: drugbank_src,
			target_title_src: chembl_src,
			target_concatenated_uris_src: chembl_src,


			//for target
			chembl_activity_uri: chembl_activity_uri,
			chembl_compound_uri: chembl_compound_uri,
			compound_full_mwt: compound_full_mwt,
			cw_compound_uri: cw_compound_uri,
			compound_pref_label: compound_pref_label,
			cs_compound_uri: cs_compound_uri,
			csid: csid,
			compound_inchi: compound_inchi,
			compound_smiles: compound_smiles,
			chembl_assay_uri: chembl_assay_uri,
			chembl_target_uri: chembl_target_uri,

			target_organism: target_organism,
			target_organisms: target_organisms,
			target_pref_label: target_pref_label,

			assay_organism: assay_organism,
			assay_description: assay_description,
			activity_relation: activity_relation,
			activity_standard_units: activity_standard_units,
			activity_standard_value: activity_standard_value,
			activity_activity_type: activity_activity_type,
			activity_pubmed_id: activity_pubmed_id,

			compound_full_mwt_src: chembl_src,
			compound_pref_label_src: cw_src,
			compound_inchi_src: cs_src,
			compound_smiles_src: cs_src,
			target_organism_src: chembl_src,
			target_pref_label_src: cw_src,
			assay_organism_src: chembl_src,
			assay_description_src: chembl_src,
			activity_relation_src: chembl_src,
			activity_standard_units_src: chembl_src,
			activity_standard_value_src: chembl_src,
			activity_activity_type_src: chembl_src,

			compound_pref_label_item: compound_pref_label_item,
			activity_activity_type_item: activity_activity_type_item,
			activity_relation_item: activity_relation_item,
			activity_standard_value_item: activity_standard_value_item,
			activity_standard_units_item: activity_standard_units_item,
			compound_full_mwt_item: compound_full_mwt_item,
			compound_smiles_item: compound_smiles_item,
			compound_inchi_item: compound_inchi_item,
			compound_inchikey_item: compound_inchikey_item,
			target_pref_label_item: target_pref_label_item,
			assay_organism_item: assay_organism_item,
			assay_description_item: assay_description_item,
			target_organism_item: target_organism_item,
			targets: targets
		});
	});
	return records;
}