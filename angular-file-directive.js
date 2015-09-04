'use strict';

angular.module('ngFile', [])
  .directive('file', [function () {
    return {
      scope: {
        file: '='
      },
      link: function (scope, elem) {
        // Listen for change in the input element
        elem.bind('change', function (changeEvent) {
          var files = [];
          // For Each targeted file
          angular.forEach(changeEvent.target.files, function (file) {
            // Check if file type is 'text'
            var isText = file.type.indexOf('text/') === 0;
            var reader = new FileReader();
            reader.file = file;
            reader.onload = function (e) {
              var body = e.target.result;

              // Compile data from file
              files.push({
                updatedAt: file.lastModifiedDate.toJSON(),
                size: file.size,
                type: file.type,
                name: file.name,
                body: body,
                file : file
              });
              // Apply new values to $scope when the last file is done.
              if (files.length === changeEvent.target.files.length) {
                scope.$apply(function () {
                  scope.file = files;
                });
              }
            };
            // Read file as 'text' or 'binary string'
            if (isText) {
              reader.readAsText(file);
            } else {
              reader.readAsArrayBuffer(file);
            }
          });
        });
      }
    };
  }])
  .factory('base64EncodeArrayBuffer', function () {
    return function(arraybuffer) {
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var bytes = new Uint8Array(arraybuffer),
      i, len = bytes.length, base64 = "";
  
      for (i = 0; i < len; i+=3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
      }
  
      if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }
  
      return base64;
    };
  });
