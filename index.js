var fetchStreaming = function(url, request, onStream) {
  if (arguments.length === 2) {
    if (typeof request === 'function') {
      onStream = request;
      request = null;
    }
  }
  if (onStream == null) onStream = function() {};
  if (request == null) request = {};
  if (!url) throw new TypeError('URL is required');
  if (!request.method) request.method = 'GET';
  request.url = url;

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      var status = xhr.status;
      if (status < 100 || status > 599) return reject(new TypeError('Network request failed'));
      var options = {
        status: status,
        statusText: xhr.statusText,
        body: 'response' in xhr ? xhr.response : xhr.responseText
      };
      resolve(options);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 3) {
        var freshData = xhr.response.substr(xhr.seenBytes);
        xhr.seenBytes = xhr.responseText.length;
        onStream(freshData);
      }
    };

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    };

    xhr.open(request.method, request.url, true);

    (request.headers || []).forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    });

    xhr.send();
  });
};

if (typeof module === 'object' && module.exports) {
  module.exports = fetchStreaming
} else {
  window.fetchStreaming = fetchStreaming;
}
