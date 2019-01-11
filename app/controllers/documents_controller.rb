class DocumentsController < ApplicationController
  def new
    @documents = Document.all
  end

  def store
    if Blob.where(filename: params[:name], byte_size: params[:size]).first
      return render json: { message: "The file #{params[:name]} already exists on store-box." }, status: 400
    end

    @document = Document.create()

    @document.file.attach(params[:file])

    render json: {
      id: @document.id,
      filename: @document.file.filename,
      download_url: rails_blob_path(@document.file)
    }
  end
end
