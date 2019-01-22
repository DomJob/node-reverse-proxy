# Node Reverse Proxy

This is an extremely simple reverse proxy aimed to be a lightweight alternative to nginx/apache for small projects.

For example, if your domain is `example.com` and you got an HTTP app running on port 3000, you can set up `anything.example.com` to redirect traffic to port 3000, securely through SSL.

## Pros

1. Lightweight, setup within seconds
2. Dependency free
3. Supports SSL

## Cons

1. Websockets aren't supported
2. Probably can't handle a lot of requests

## Usage

1. Acquire `rproxy.js` and `config.json`
2. Edit `config.json` to tailor it to your needs. 
3. Run `node rproxy.js`. You might need to run it as root to use port 80 and 443.

### Forwarding services

I think the example `config.json` is self-explanatory, but just in case:

    "services" :
    {
     "www" : 5000,
     "files": 8000,
     "notes": 1234
    }
    
In this example, `www.domain.com` will connect to port 5000 and forward that service's HTTP to the user. `files.domain.com` will forward the service at port 8000, etc.

Note: going to `domain.com` will redirect to whatever port the `www` subdomain is assigned to.

## SSL support

You can serve a simple HTTP app on any arbitrary port, then serve that app through a secure HTTPS connection with this script. Of course, you need the proper SSL certificate for the subdomains you intend to use. I recommend getting a wildcard certificate for `yourdomain.com` and `*.yourdomain.com` from LetsEncrypt (I always use [this docker procedure](https://www.bennadel.com/blog/3420-obtaining-a-wildcard-ssl-certificate-from-letsencrypt-using-the-dns-challenge.htm))

Optionally (and recommended), you can force HTTP requests to go through HTTPS. Otherwise disable SSL and proceed at your own risks.

