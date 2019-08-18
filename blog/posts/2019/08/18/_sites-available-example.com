server {
  listen 80;
  listen [::]:80;

  server_name example.com *.example.com;

  location / {
    return 200 "OK";
  }
}