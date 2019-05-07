FROM apsstandard/aps-php-runtime

# Copy Apache configuration and data structures
ADD /deploy-image/etc /etc
ADD /deploy-image/var /var

# Add the APS application provisioning logic
ADD /scripts /var/www/aps-php-runtime/scripts

# Access rights
RUN chown -R apache:apache /var/www/aps-php-runtime

# Application port that will be bound to external container port
EXPOSE 1443

# Data to save during App upgrade
VOLUME /var/www/aps-php-runtime/logs
VOLUME /var/www/aps-php-runtime/scripts/config

# Run Apache in foreground as a container process
ADD /deploy-image/run-httpd.sh /root/run-httpd.sh
ENTRYPOINT sh /root/run-httpd.sh
