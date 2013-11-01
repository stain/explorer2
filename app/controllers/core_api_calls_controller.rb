require 'uuidtools'
require 'tempfile'

class CoreApiCallsController < ApplicationController

  # Given query params, a URI and total count of results download them all
  # as a tsv file and return it. The download requests batches of 250 from
  # the Linked Data API server using delayed job and the TsvFile model
  def tab_separated_file
    uuid = UUIDTools::UUID.random_create.to_s
    tsv_file = TsvFile.new
    tsv_file.save
    tsv_file.update_attributes(:uuid => uuid)
    tsv_file.process params
    response = {"uuid" => uuid}
    respond_to do |format|
      format.json {
        #render :json => "[{'uuid' : '#{uuid}'}]"   
        render :json => response
      }
    end
  end

  # How much of the tsv file has been created
  # so far
  def tsv_status
    tsv_file = TsvFile.where(:uuid => params[:uuid]).first
    status = tsv_file.status
    percentage = tsv_file.percentage
    respond_to do |format|
      format.json {
        render :json => "[{'status' : '#{status}','percentage' : '#{percentage}'}]"   
      }
    end
  end

  # Download a particular tsv file
  def tsv_download
    @tsv_file = TsvFile.where(:uuid => params[:uuid]).first
    if @tsv_file.status == "finished" && @tsv_file.percentage == 100
      send_file File.join(Rails.root, 'filestore', @tsv_file.uuid), :filename => 'output.tsv', :content_type => "text/tab-separated-values", :disposition => 'attachment', :stream => false
    else
      render :layout => false
    end
  end

end