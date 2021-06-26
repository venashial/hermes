# Hermes

Hermes is a service that connects webhooks to Modrinth project releases. Hermes is built with a backend in NodeJS and a frontend using vanilla JS with EJS for templating. Hermes is not affilated with Modrinth.

## Usage
1. Get a webhook URL from an app like Discord.
2. Get your Modrinth project ID.
3. Enter them at [venashial.design/hermes/](https://venashial.design/hermes/) or on your own local instance.

> [venashial.design/hermes/](https://venashial.design/hermes/) will be unavailable until Hermes reaches a usable state.

## Installation
#### Docker (Recommended)
Use the Docker image `ghcr.io/venashial/hermes`.

#### Node
Set up a dev enviroment and leave the process running.

## Develop
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev
```

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)