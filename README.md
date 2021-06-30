<p align="center">
  <img src="static/images/logo/icon.svg" width="90" title="Logo">
</p>
<h1 align="center">Hermes</h1>

![](https://img.shields.io/github/package-json/v/venashial/hermes?style=for-the-badge) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/venashial/hermes/docker-build?style=for-the-badge) ![](https://img.shields.io/github/license/venashial/hermes?style=for-the-badge&) ![GitHub last commit](https://img.shields.io/github/last-commit/venashial/hermes?style=for-the-badge)

Hermes is a service that connects webhooks to Modrinth project releases. In addition, it has a RSS, Atom, and JSON feeds for Modrinth projects. The Hermes backend uses NodeJS and is connected to a PostgreSQL database. The frontend uses vanilla JS with server-side EJS for templating.

----

## Usage
### Webhooks
1. Get a webhook URL from an app like Discord.
2. Get one or multiple Modrinth project IDs.
3. Enter both on a public instance listed below or on your own local instance.

### Feeds (RSS, Atom, JSON)
1. Get your Modrinth project ID.
2. Make a feed URL using the structure `<hermes-instance>/api/feed/:format/:project_id`.<br />
Supported formats: `rss`, `atom`, `json`.

> Here's a feed URL example for [Lithium](https://modrinth.com/mod/lithium)
> ```
> https://hermes-webhooks.herokuapp.com/api/feed/rss/gvQqBUqZ
> ```

----

## Public instances
| Status | Uptime | URL |
| --- | --- | --- |
| ![](https://img.shields.io/website?style=for-the-badge&url=https%3A%2F%2Fhermes-webhooks.herokuapp.com%2F) | ![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m788561541-bbab44bed8072f1b9ee7b9fe?style=for-the-badge) | [https://hermes-webhooks.herokuapp.com/](https://hermes-webhooks.herokuapp.com/) |

----
## Alternative self-hosting
#### Docker compose (Recommended)
Make a copy of [this file called `docker-compose.yml`](./examples/docker-compose.yml) and in the same directory as that file run:
```bash
docker-compose up -d
```
Now go use Hermes at http://localhost:8050/! (Or at `http://<server-ip>:8050/` if you aren't running it locally. )

#### Heroku (Recommended)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) <br />
[Make your Heroku app stay online.](https://kaffeine.herokuapp.com) To run your app without a bedtime, add your credit card to your Heroku. (Heroku won't charge you for anything.)

#### Docker
First, run a PostgreSQL container:
```bash
docker run --name hermes-postgres -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_USER=username -e POSTGRES_DB=hermes -p 5432:5432/tcp -d --restart unless-stopped postgres
```
Next, run the Hermes container: (Replace `example.com` with the domain where hermes will be)
```bash
docker run --name hermes -e DATABASE_URL='postgres://username:secretpassword@localhost:5432/hermes' -e DOMAIN='example.com' -p 8050:8060/tcp --restart unless-stopped ghcr.io/venashial/hermes:master
```
You'll either want to change the port from 6000 to 80, and port forward that OR use something like Nginx to reverse proxy the

#### Node
Clone the repo, install dependencies, and run `npm start`. In addition, run an instance of Postgres.
> Required environment variables: <br />
> **DOMAIN** (`'example.com'`) <br />
> **DATABASE_URL** (`'postgres://user:password@examplepostgres.com/databasename'`)<br />
> Optional: <br />
> **USE_DATABASE_SSL** (`true`)

----
## Develop
> Requires `node` to be installed
```bash
# install dependencies
$ npm install

# set up database
$ npm run migrate:latest

# serve with hot reload at localhost:3000
$ npm run dev
```

### TODOs
- [ ] API tests
- [ ] Fix modrinth version timestamps
- [ ] Frontend rewrite in Svelte
  - [ ] Add Jest tests
  - [ ] Add curseforge links
  - [ ] Client side form errors
  - [ ] Modrinth project name preview
  - [ ] Discord/json message preview

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)

----

Hermes is not affiliated with Modrinth.
