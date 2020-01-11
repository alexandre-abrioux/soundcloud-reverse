FROM php:7.3.9-apache-buster
RUN a2enmod expires
COPY apache.conf /etc/apache2/conf-enabled/zzz-custom.conf
COPY apache-site.conf /etc/apache2/sites-enabled/zzz-custom.conf
COPY php.ini /usr/local/etc/php/conf.d/zzz-custom.ini
