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
  var headers = request.headers || {};
  request.url = url;

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      var status = xhr.status;
      if (status < 100 || status > 599) return reject(new TypeError('Network request failed'));
      var type = xhr.getResponseHeader('content-type') || '';
      var body = xhr.responseText;
      if (type.indexOf('application/json') !== -1) {
        try { body = JSON.parse(body); } catch(e) {}
      } else if ('response' in xhr) {
        body = xhr.response;
      }
      var options = {
        status: status,
        statusText: xhr.statusText,
        body: body,
        xhr: xhr
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

    xhr.onerror = function(error) {
      reject(new TypeError('Network request failed ' + error))
    };

    xhr.open(request.method, request.url, true);

    Object.keys(headers).forEach(function(name) {
      var value = headers[name];
      xhr.setRequestHeader(name, value)
    });

    xhr.send(request.body);
  });
};

if (typeof module === 'object' && module.exports) {
  module.exports = fetchStreaming
} else {
  window.fetchStreaming = fetchStreaming;
}

