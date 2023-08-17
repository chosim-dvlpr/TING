# 2-1. Nginx

### frontend nginx configuration

- 위치 경로 - /ting-frontend/conf/conf.d/default.conf

```
server {
    listen 5442;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass { HTTP_SERVER_DOMAIN };
    }
    
    error_page   500 502 503 504  /50x.html;
    
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### openvidu custom-nginx.conf

- 위치 경로 - /opt/openvidu/custom-nginx.conf

```
# Your App
upstream yourapp {
    server localhost:5442;
}

upstream openviduserver {
    server localhost:5443;
}

server {
    listen 80;
    listen [::]:80;
    server_name { SERVER_HOST };

    # Redirect to https
    location / {
        rewrite ^(.*) { HTTPS_SERVER_DOMAIN }$1 permanent;
    }

    # letsencrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location /nginx_status {
        stub_status;
        allow 127.0.0.1;        #only allow requests from localhost
        deny all;               #deny all other hosts   
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name { SERVER_HOST };

    # SSL Config
    ssl_certificate         { FULL_CHAIN_PEM_PATH }
    ssl_certificate_key     { PRIVATE_PEM_PATH };
    ssl_trusted_certificate { FULL_CHAIN_PEM_PATH };

    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 5m;
    ssl_stapling on;
    ssl_stapling_verify on;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers "{ SSL_CIPHERS }";
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    # Proxy
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Proto https;
    proxy_headers_hash_bucket_size 512;
    proxy_redirect off;

    # Websockets
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

		# Your App
    location / {
        proxy_pass http://yourapp; # Openvidu call by default
    }

    ########################
    # OpenVidu Locations   #
    ########################
    #################################
    # Common rules CE              #
    #################################
    # Dashboard rule
    location /dashboard {
        allow all;
        deny all;
        proxy_pass http://openviduserver;
    }

    # Websocket rule
    location ~ /openvidu$ {
        proxy_pass http://openviduserver;
    }

    #################################
    # New API                       #
    #################################
    location /openvidu/layouts {
        rewrite ^/openvidu/layouts/(.*)$ /custom-layout/$1 break;
        root /opt/openvidu;
    }

    location /openvidu/recordings {
        proxy_pass http://openviduserver;
    }

    location /openvidu/api {
        allow all;
        deny all;
        proxy_pass http://openviduserver;
    }

    location /openvidu/info {
        allow all;
        deny all;
        proxy_pass http://openviduserver;
    }

    location /openvidu/accept-certificate {
        proxy_pass http://openviduserver;
    }

    location /openvidu/cdr {
        allow all;
        deny all;
        proxy_pass http://openviduserver;
    }

    #################################
    # LetsEncrypt                   #
    #################################
    location /.well-known/acme-challenge {
        root /var/www/certbot;
        try_files $uri $uri/ =404;
    }

}
```