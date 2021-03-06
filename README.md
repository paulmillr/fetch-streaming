# fetch-streaming

Simple XMLHTTPRequest-based `fetch` implementation for streaming content.

60 LOC and no dependencies, works in all browsers.

This is not a replacement for `fetch` - there is no API match.

## Install

`npm install --save fetch-streaming`

## Usage

```javascript
const fetchS = require('fetch-streaming');

// Would be executed for every new chunk of data.
fetchS('/api/stream', stream => console.log(stream));

// Options
const options = {method: 'POST', headers: {'Content-Type': 'BS'}};
fetchS('/api/stream', options, stream => console.log(stream));

// Promise is returned.
const result = fetchS('/api/stream');
result.then(response => {console.log(response.body)}, error => {console.error(error)})
```

## Tips

Example of server-side `express.js` infinite endpoint.

```javascript
app.get('/api/stream', (req, res) => {
  res.write(Date.now().toString());

  // Send new data every second.
  setInterval(() => {
    res.write(Date.now().toString());
  }, 1000);
});
```

## License

MIT
