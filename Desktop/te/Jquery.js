var jQueryXMLHttpRequest; // Global variable to store the XMLHttpRequest

$(function () {
          // Populate the file list on page load
          populateList();

          var fileList = $('#fileList');
          fileList.on('change', function () {
                    loadContent();
          });
          
          $('#saveButton').on('click', function () {
                    saveContent();
          });
          $('#saveAsButton').on('click', function () {
                    saveAsContent();
          });
});

/* ===================================================== /
/ FUNCTION : populateList()                              /
/ DESCRIPTION : Populates the file list on page load     /
/ PARAMETERS : None                                      /
/ RETURN VALUES : None                                   /
/ ===================================================== */
function populateList() {
          jQueryXMLHttpRequest = $.ajax({
                    type: 'POST',
                    url: "startPage.aspx/GetFile",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                              var fileList = $('#fileList');
                              fileList.empty();
                              // Loop through the list of files and add them to the dropdown
                              $.each(JSON.parse(data.d), function (index, fileName) {
                                        fileList.append($('<option>', {
                                                  value: fileName,
                                                  text: fileName
                                        }));
                              });
                    },
                    error: function (xhr, textStatus, errorThrown) {
                              console.error('Error fetching file list', errorThrown);
                    }
          });
}

/* ===================================================== /
/ FUNCTION : loadContent()                               /
/ DESCRIPTION : Loads content of the selected file       /
/ PARAMETERS : None                                      /
/ RETURN VALUES : None                                   /
/ ===================================================== */
function loadContent() {
          var selectedFile = $('#fileList').val();
          jQueryXMLHttpRequest = $.ajax({
                    type: 'POST',
                    url: "startPage.aspx/loadFileContent",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ fileName: selectedFile }),
                    success: function (data) {
                              // Set the content of the editor with the loaded file content
                              $('#editor').val(JSON.parse(data.d));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                              console.error('Error fetching file content', errorThrown);
                    }
          });
}

/* ===================================================== /
/ FUNCTION : saveContent()                               /
/ DESCRIPTION : Saves content to the selected file       /
/ PARAMETERS : None                                      /
/ RETURN VALUES : None                                   /
/ ===================================================== */
function saveContent() {
          var selectedFile = $('#fileList').val();
          var content = $('#editor').val();

          jQueryXMLHttpRequest = $.ajax({
                    type: 'POST',
                    url: "startPage.aspx/SaveFileContent",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ fileName: selectedFile, content: content }),
                    success: function (data) {
                              // Show an alert with the result of the save operation
                              alert(data.d);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                              console.error('Error saving file content', errorThrown);
                    }
          });
}

/* ===================================================== /
/ FUNCTION : saveAsContent()                             /
/ DESCRIPTION : Saves content to a new file with a       /
/               different name                           /
/ PARAMETERS : None                                      /
/ RETURN VALUES : None                                   /
/ ===================================================== */
function saveAsContent() {
          var oldFileName = $('#fileList').val();
          var newFileName = prompt("Enter a new file name");

          if (newFileName !== null && newFileName.trim() !== "") {
                    var content = $('#editor').val();

                    // Check if the new file name already exists
                    if ($('#fileList option[value="' + newFileName + '"]').length === 0) {
                              // Save content to a new file with a different name
                              jQueryXMLHttpRequest = $.ajax({
                                        type: 'POST',
                                        url: "startPage.aspx/SaveAsFileContent",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data: JSON.stringify({ oldFileName: oldFileName, newFileName: newFileName, content: content }),
                                        success: function (data) {
                                                  // Show an alert with the result of the save operation
                                                  alert(data.d);
                                                  // Refresh the file list after Save As
                                                  populateList();
                                        },
                                        error: function (xhr, textStatus, errorThrown) {
                                                  console.error('Error saving file content', errorThrown);
                                        }
                              });
                    } else {
                              // Display an error message if the new file name already exists
                              alert("Error: File with the same name already exists. Please choose a different name.");
                    }
          }
}

/* ===================================================== /
/ FUNCTION : handleFileSelect()                          /
/ DESCRIPTION : Handles the selection of a local file    /
/ PARAMETERS : event - The event object                  /
/ RETURN VALUES : None                                   /
/ ===================================================== */
function handleFileSelect(event) {
          var fileInput = event.target;
          var file = fileInput.files[0];

          var reader = new FileReader();
          reader.onload = function (e) {
                    var content = e.target.result;
                    console.log(content);
          };

          reader.readAsText(file);
}

// Attach the function to the change event of the file input
$('#fileInput').on('change', handleFileSelect);