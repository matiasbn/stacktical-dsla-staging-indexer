# stacktical-dsla-staging-indexer

Rest API to mock the production indexer.

It recreates the production indexer behavior by generating random efficiency data if the parameters cannot be found on a Mongo database, 
and returning the already generated data if it can find it.

# Scripts
## Run dev service
```npm run dev```
## Build the bundle
```npm run build```
## Start the production service
```npm run start```

# Examples

All this calls use the same parameters, with the difference of where they're pointing i.e. localhost, staging or production
## Dev example api call
```http://localhost:3333/api?query=%7B%0A%20%20getSLI%28%0A%20%20%20%20sla_address%3A%20%220xf7cdda73b01Bd3A3D229C20f3225B6FB687d1941%22%0A%20%20%20%20sla_monitoring_start%3A%20%221577836800000000000%22%0A%20%20%20%20sla_monitoring_end%3A%20%221594026520000000000%22%0A%20%20%29%0A%7D%0A```
## Staging example api call
```https://dsla-staging-indexer.herokuapp.com/api?query=%7B%0A%20%20getSLI%28%0A%20%20%20%20sla_address%3A%20%220xf7cdda73b01Bd3A3D229C20f3225B6FB687d1941%22%0A%20%20%20%20sla_monitoring_start%3A%20%221577836800000000000%22%0A%20%20%20%20sla_monitoring_end%3A%20%221594026520000000000%22%0A%20%20%29%0A%7D%0A```
The service is already deployed on Heroku.

## Production example api call
```https://dsla.network/api?query=%7B%0A%20%20getSLI%28%0A%20%20%20%20sla_address%3A%20%220xf7cdda73b01Bd3A3D229C20f3225B6FB687d1941%22%0A%20%20%20%20sla_monitoring_start%3A%20%221577836800000000000%22%0A%20%20%20%20sla_monitoring_end%3A%20%221594026520000000000%22%0A%20%20%29%0A%7D%0A```

# Codebase 

## Api Path
``apps/staging-indexer/src/api``

### api.controller.ts
The controller of the API. It parses all the API calls that points to /api route

### api.module.ts
Defines the Api module dependencies.

### api.service.ts
Here we store the endpoints business logic, along with the interaction with the service repositories.

### sli.repository.ts
Here we define the interactions with the Mongo database, to ne called by api service file.

### sli.schema.ts
Here we define the Mongoose schema for the SLI object.

### types.ts
Types file.

## App path
It contains the whole "app", being the "API" a module of it. 
``apps/staging-indexer/src``

### main.ts
Entry point for the app.
### app.controller.ts
The controller of the APP. contains only 1 endpoint, the health endpoint.
This is triggered by calling the base url of the api e.g. http://localhost:3333.
It return stats of the service as a health check signal.
### app.module.ts
Defines the App module dependencies. It includes the Api module.

