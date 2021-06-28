<p align="center">
  <img src="static/images/logo/icon.svg" width="90" title="Logo">
</p>
<h1 align="center">Hermes</h1>

![](https://img.shields.io/github/package-json/v/venashial/hermes?style=for-the-badge) ![](https://img.shields.io/github/checks-status/venashial/hermes/master?style=for-the-badge) ![](https://img.shields.io/github/license/venashial/hermes?style=for-the-badge)

Hermes is a service that connects webhooks to Modrinth project releases. Hermes is built with a backend in NodeJS and a frontend using vanilla JS with EJS for templating. Hermes is not affilated with Modrinth.

## Usage
1. Get a webhook URL from an app like Discord.
2. Get your Modrinth project ID.
3. Enter both on a public instance listed below or on your own local instance.

## Public instances
| Status | Uptime | URL |
| --- | --- | --- |
| ![](https://img.shields.io/website?style=for-the-badge&url=https%3A%2F%2Fhermes-webhooks.herokuapp.com%2F) | ![](https://img.shields.io/uptimerobot/ratio/key?style=for-the-badge) | [https://hermes-webhooks.herokuapp.com/](https://hermes-webhooks.herokuapp.com/) |

## Installation
#### Docker (Recommended)
Use the Docker image `ghcr.io/venashial/hermes`.

#### Node
Clone the repo, install dependencies, and run `npm start`.

### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

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