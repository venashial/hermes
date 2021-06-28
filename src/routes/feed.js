const modrinth = require('../modrinth')

const { Feed } = require('feed')

module.exports = function (app) {
  app.get('/api/feed/:format/:project_id', async function (req, res) {
    if (req.params.format !== 'rss' && req.params.format !== 'atom' && req.params.format !== 'json') {
      res.sendStatus(400)
    } else {
        const modrinthProject = await modrinth.getProject(req.params.project_id).catch(err => res.status(400).send('Couldn\'t find project on Modrinth'))

        const feed = await makeFeed(modrinthProject, req.params.format)

        res.send(feed)
    }
  })
}

async function makeFeed(modrinthProject, format) {
  const project_url = `https://modrinth.com/mod/${
    modrinthProject.slug || modrinthProject.id
  }`

  const author = await modrinth.getOwner(modrinthProject.team)

  const feed = new Feed({
    title: modrinthProject.title,
    description: modrinthProject.description,
    id: project_url,
    link: project_url,
    language: "en",
    image: modrinthProject.icon_url,
    updated: new Date(modrinthProject.updated),
    /* // TODO: Find instance URL from envs
    feedLinks: {
      json: "https://example.com/json",
      atom: "https://example.com/atom"
    },
    */
    author: {
      name: author.username,
      link: author.url
    }
  });

  const modrinthVersions = await modrinth.getVersions(modrinthProject.id)
  
  modrinthVersions.forEach(version => {
    feed.addItem({
      title: `${modrinthProject.title} ${version.version_type}`,
      id: `${project_url}/version/${version.id}`,
      link: `${project_url}/version/${version.id}`,
      description: version.name,
      content: version.changelog,
      author: [
        {
          name: author.username,
          link: author.url
        }
      ],
      image: modrinthProject.icon_url,
      date: new Date(version.date_published),
    });
  });

  if (format === 'rss') {
    return feed.rss2()
  } else if (format === 'json') {
    return feed.json1()
  } else if (format === 'atom') {
    return feed.atom1()
  }
}