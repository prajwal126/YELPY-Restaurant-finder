FROM php:7-apache
MAINTAINER prajwalprasad22@gmail.com


# Copy application source
COPY . /var/www/html
RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html
EXPOSE 80