var Openphacts=Openphacts||{};Openphacts.CompoundSearch=function CompoundSearch(a){this.baseURL=a};Openphacts.CompoundSearch.prototype.fetchCompound=function(c,e,b,d){var a=$.ajax({url:this.baseURL+"/compound",cache:true,data:{_format:"json",uri:b,app_id:c,app_key:e},success:function(g,f,h){d.call(this,true,h.status,g.result.primaryTopic)},error:function(h,f,g){d.call(this,false,h.status)}})};Openphacts.CompoundSearch.prototype.parseCompoundResponse=function(a){var d,b,g;var c=a._about;var f=c.split("/").pop();var e=a.prefLabel;$.each(a.exactMatch,function(h,j){if(j._about){if(j._about.indexOf("http://www4.wiwiss.fu-berlin.de/drugbank")!==-1){d=j}else{if(j._about.indexOf("http://linkedlifedata.com/resource/drugbank")!==-1){d=j}else{if(j._about.indexOf("http://www.chemspider.com")!==-1){b=j}else{if(j._about.indexOf("http://rdf.chemspider.com")!==-1){b=j}else{if(j._about.indexOf("http://data.kasabi.com/dataset/chembl-rdf")!==-1){g=j}}}}}}});return{id:f,prefLabel:e,cwUri:c,description:d?d.description:null,biotransformationItem:d?d.biotransformation:null,toxicity:d?d.toxicity:null,proteinBinding:d?d.proteinBinding:null,csUri:b?b._about:null,hba:b?b.hba:null,hbd:b?b.hbd:null,inchi:b?b.inchi:null,logp:b?b.logp:null,psa:b?b.psa:null,ro5Violations:b?b.ro5_violations:null,smiles:b?b.smiles:null,chemblURI:g?g._about:null,fullMWT:g?g.full_mwt:null,molform:g?g.molform:null,mwFreebase:g?g.mw_freebase:null,rtb:g?g.rtb:null}};Openphacts.TargetSearch=function TargetSearch(a){this.baseURL=a};Openphacts.TargetSearch.prototype.fetchTarget=function(c,e,a,d){var b=$.ajax({url:this.baseURL+"/target",cache:true,data:{_format:"json",uri:a,app_id:c,app_key:e},success:function(g,f,h){d.call(this,true,h.status,g.result.primaryTopic)},error:function(h,f,g){d.call(this,false,h.status)}})};Openphacts.TargetSearch.prototype.parseTargetResponse=function(d){var g,a,f;var h=d._about;var b=h.split("/").pop();var e=[];var i=[];var c=[];$.each(d.exactMatch,function(j,k){if(k._about){if(k._about.indexOf("http://www4.wiwiss.fu-berlin.de/drugbank")!==-1){g=k}else{if(k._about.indexOf("http://linkedlifedata.com/resource/drugbank")!==-1){g=k}else{if(k._about.indexOf("http://data.kasabi.com/dataset/chembl-rdf")!==-1){a=k;$.each(a.keyword,function(l,m){e.push(m)})}else{if(k._about.indexOf("http://purl.uniprot.org")!==-1){f=k;$.each(f.classifiedWith,function(m,l){i.push(l)});$.each(f.seeAlso,function(m,l){c.push(l)})}}}}}});return{id:b,cellularLocation:g?g.cellularLocation:null,molecularWeight:g?g.molecularWeight:null,numberOfResidues:g?g.numberOfResidues:null,theoreticalPi:g?g.theoreticalPi:null,drugbankURI:g?g._about:null,description:a?a.description:null,subClassOf:a?a.subClassOf:null,keywords:e,functionAnnotation:f?f.Function_Annotation:null,alternativeName:f?f.alternativeName:null,existence:f?f.existence:null,organism:f?f.organism:null,sequence:f?f.sequence:null,classifiedWith:i,seeAlso:c}};Openphacts.ConceptWikiSearch=function(a){this.baseURL=a};Openphacts.ConceptWikiSearch.prototype.byTag=function(f,h,e,a,c,b,g){var d=$.ajax({url:this.baseURL+"/search/byTag",cache:true,data:{q:e,limit:a,branch:c,uuid:b,app_id:f,app_key:h},success:function(j,i,k){g.call(this,true,k.status,j.result.primaryTopic.result)},error:function(k,i,j){g.call(this,false,k.status)}})};Openphacts.ConceptWikiSearch.prototype.parseResponse=function(b){var a=[];$.each(b,function(d,c){a.push(c._about)});return a};