// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

var uploadButton = document.getElementById('upload-button')
var progressBars = document.getElementById('progress-bars')
var fileUploadInput = document.getElementById('file-upload')
var documentsList = document.getElementById('documents-list')
var downloadButtons = document.getElementsByClassName('download-button')

function generateNewListItem (document) {
  return "<li class='list-group-item'>"  +  document.filename  + "<a class='btn btn-info download-button float-right btn-sm' data-download-id="+ document.id + " href="+ document.download_url +" target='_blank' download >Download</a>" + "</li>"
}

uploadButton.addEventListener('click', function () {
  fileUploadInput.click()
})

function getProgressbar(name) {
  return document.querySelector('[data-file-name="' + name + '"]')
}

function handleUploadProgress(progress, file) {
  var percentage = Math.floor((progress.loaded / progress.total) * 100)
  var progressbar = getProgressbar(file.name)
  var innerProgressbar = progressbar.querySelector('.progress-bar')
  innerProgressbar.style = 'width: ' + percentage + '%'
  innerProgressbar.innerHTML = percentage + '%'
}

function generateProgressBar(file) {
  return "<li class='list-group-item' data-file-name='"+ file.name +"'>" +
            "<span class='mb-1 font-weight-bold d-block'>"
              + file.name  + " - " + Math.floor(file.size / 1000) + ' kb' + 
            "</span>" +
            "<div class='progress'>" + 
              "<div class='progress-bar' style='width: 0%'>0%</div>"+
            "</div>" +
        "</li>"
}

function removeProgressbar(name) {
  var progressbar = getProgressbar(name)
  progressbar.parentNode.removeChild(progressbar)
}


function handleFileUpload(files) {
  var file = files[0]
  var formData = new FormData()
  formData.append('file', file)
  formData.append('name', file.name)
  formData.append('size', file.size)
  formData.append('authenticity_token', document.head.querySelector('meta[name="csrf-token"]').content)

  var uploadProgress = function (progress) {
    handleUploadProgress(progress, file)
  }
  var progressBarForUpload = generateProgressBar(file)

  progressBars.innerHTML += progressBarForUpload

  axios.post('/documents/store', formData, {
    onUploadProgress: uploadProgress
  }).then(function(response) {
    var document = generateNewListItem(response.data)
    documentsList.innerHTML += document

    new Noty({
      text: 'Successfully uploaded file: ' + file.name,
      timeout: 5000,
      type: 'success'
    }).show()

    removeProgressbar(file.name)
   }).catch(e => {
     var message = e.response.data.message

     new Noty({
      text: message,
      timeout: 5000,
      type: 'error'
    }).show()

     removeProgressbar(file.name)
   })
}

fileUploadInput.addEventListener('change', function (event) {
  handleFileUpload(event.target.files)
})

