require 'CGI'

class SearchController < ApplicationController

  def index
    query = params[:query]
    @compounds = find_compounds query
    #@targets = find_targets query
    #@enzymes = find_enzymes query
  end

  def find_compounds query
  
    concept_wiki_searcher = Searcher::ConceptWikiSearcher.new
    concept_wiki_searcher.search query, "4", "07a84994-e464-4bbf-812a-a4b96fa3d197"
    searcher = Searcher::CompoundSearcher.new
    results = searcher.search query

  end

  def find_targets query

    searcher = Searcher::TargetSearcher.new
    results = searcher.search query

  end

  def find_enzymes query

    searcher = Searcher::EnzymeSearcher.new
    results = searcher.search query

  end

  def free_text

  end

end
