ARG DOCKER_IMAGE_NODE

FROM ${DOCKER_IMAGE_NODE} as node
WORKDIR /usr/src/app/
COPY package.json package-lock.json ./
RUN npm ci
COPY webpack.config.js ./
COPY assets ./assets/
COPY src ./src/
RUN npm run build

FROM fholzer/nginx-brotli:v1.18.0
## remove nginx welcome page
RUN rm /usr/share/nginx/html/*
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/start.sh /start.sh
RUN chmod 755 /start.sh
CMD ["/start.sh"]
COPY ./public/ /usr/share/nginx/html/
COPY --from=node /usr/src/app/dist/ /usr/share/nginx/html/
