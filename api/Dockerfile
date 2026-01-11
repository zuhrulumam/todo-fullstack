FROM php:8.2-cli-alpine

RUN apk add --no-cache $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_mysql \
    && apk del $PHPIZE_DEPS

WORKDIR /app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN php artisan config:cache && \
    php artisan route:cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]