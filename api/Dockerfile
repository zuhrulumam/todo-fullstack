FROM php:8.4-cli-alpine

RUN apk add --no-cache $PHPIZE_DEPS postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apk del $PHPIZE_DEPS

WORKDIR /app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Fix permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chmod -R 775 storage bootstrap/cache

RUN php artisan config:cache && \
    php artisan route:cache

EXPOSE 8000

# Run migrations then start server
CMD php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8000