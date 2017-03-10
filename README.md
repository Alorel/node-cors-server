A CORS proxy ready to be deployed to Redhat Cloud, Heroku or whatever it is you use.

Built with Node 7, might work with older versions.

# Demo

https://corsproxy-alorel.rhcloud.com/

# Safeguards

- Non-GET requests are blocked; HTTP 400 is returned.
- Content-Length filtering
- Content-Type filtering

# Configuration

Edit **config.json**.

  - cache_max_age
    - Every request to the proxy results in a HEAD request being made to the target URL to filter out the content type and
    content length. This is how long these requests are cached for.
  - cache_size
    - Maximum number of HEAD requests in cache.
  - headers
    - cors
      - List of headers to append to CORS requests
    - global
      - List of headers to append to **every** request
  - ctypes
    - deny
      - CORS requests will be rejected if the target resource content-type contains any of these substrings
    - allow
      - If *deny* didn't block the request yet, check this array. Only content types containing one of these substrings
      will be allowed.