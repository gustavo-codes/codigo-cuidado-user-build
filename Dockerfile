FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN echo -e 'events {}\nhttp {\n    include /etc/nginx/mime.types;\n    server {\n        listen 8091;\n        location / {\n            root /usr/share/nginx/html;\n            index index.html;\n        }\n    }\n}' > /etc/nginx/nginx.conf
EXPOSE 8091
CMD ["nginx", "-g", "daemon off;"]
