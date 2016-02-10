# swagger-express

Initialize express from swagger file.

read from base.
read from default.yaml and load it into config Object
read from environment dev.yaml or prod.yaml and load into config object
get the approot from env variable
add the Swagger Object from swagger file in config for other middlewares and controllers to use.
