# DOCKER-VERSION 1.0.0

FROM smebberson/mongodb
MAINTAINER Scott Mebberson <scott@scottmebberson.com>

# Setup MongoDB from binaries
RUN usermod -u 1000 mongodb && \
    chown -R mongodb:mongodb /data/db && \
    chmod -R 777 /data/db && \
    mkdir /logs && \
    chown -R mongodb:mongodb /logs

# Add the files
ADD root /

# Expose the volume to the host
VOLUME ["logs"]

# Expose the ports for MongoDB
EXPOSE 27017
