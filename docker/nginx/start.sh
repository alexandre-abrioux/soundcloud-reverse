#!/bin/sh
set -e

envsubst '${SOUNDCLOUD_CLIENT_ID},${SOUNDCLOUD_REDIRECT_URI}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

exec nginx
