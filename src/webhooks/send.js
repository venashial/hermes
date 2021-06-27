const axios = require('axios').default

test()

async function test() {
  const modrinthProject = (
    await axios.get('https://api.modrinth.com/api/v1/mod/FIlZB9L0')
  ).data
  const modrinthVersions = (
    await axios.get('https://api.modrinth.com/api/v1/mod/FIlZB9L0/version')
  ).data

  const data = await formatModrinthData({ modrinthProject, modrinthVersions })

  const message = createBody(data, 'discord')

  console.log(message)
}

async function modrinthGetOwner(teamId) {
  const team = (
    await axios.get(`https://api.modrinth.com/api/v1/team/${teamId}/members`)
  ).data
  const user = (
    await axios.get(
      `https://api.modrinth.com/api/v1/user/${
        team.filter((user) => user.role === 'Owner')[0].user_id
      }`
    )
  ).data

  return {
    username: user.username,
    avatar_url: user.avatar_url,
    url: `https://modrinth.com/user/${user.username}`,
  }
}

async function formatModrinthData({ modrinthProject, modrinthVersions }) {
  const author = await modrinthGetOwner(modrinthProject.team)

  const project = {
    title: modrinthProject.title,
    description: modrinthProject.description,
    icon_url: modrinthProject.icon_url,
    url: `https://modrinth.com/mod/${
      modrinthProject.slug || modrinthProject.id
    }`,
    links: {
      source_code: modrinthProject.source_url,
      discord: modrinthProject.discord_url,
    },
    author: {
      ...author,
    },
  }

  const version = {
    name: modrinthVersions[0].name,
    changelog: modrinthVersions[0].changelog,
    version_type: modrinthVersions[0].version_type,
    game_versions: modrinthVersions[0].game_versions,
    loaders: modrinthVersions[0].loaders,
    url: `${project.url}/version/${modrinthVersions[0].id}`,
  }

  return { project, version }
}

async function applyRowConfig({ project, version }, config) {
  if (config.hiddenItems.includes('description')) {
    delete project.description
  }
  if (config.hiddenItems.includes('source_code')) {
    delete project.links.source_code
  }
  if (config.hiddenItems.includes('discord')) {
    delete project.links.discord
  }

  if (typeof config.additionalItems.curseforge === 'string') {
    project.links.curseforge = config.additionalItems.curseforge
  }

  return { project, version }
}

function createBody({ project, version }, content_type) {
  if (content_type === 'discord') {
    return {
      content: null,
      embeds: [
        {
          title: project.title,
          description: project.description,
          url: project.url,
          color: 4428078,
          fields: [
            {
              name: 'Release name',
              value: version.name,
              inline: true,
            },
            {
              name: 'Supported versions',
              value: version.game_versions.join(', '),
              inline: true,
            },
            {
              name: 'Changelog',
              value: version.changelog,
            },
            {
              name: '<:modrinth:858545795987931166>  Modrinth Download',
              value: `${version.url}\n\n${
                project.links.curseforge
                  ? `<:curseforge:858545795917152266>  [Curseforge](${project.links.curseforge})<:spa:858539949556891649>`
                  : ''
              }${version.url}${
                project.links.github
                  ? `<:github:858545795883204608>  [GitHub](${project.links.github})<:spa:858539949556891649>`
                  : ''
              }${version.url}${
                project.links.discord
                  ? `<:discord:858545796046389248>  [Discord](${project.links.discord})`
                  : ''
              }`,
            },
          ],
          author: {
            name: project.author.username,
            url: project.author.url,
            icon_url: project.author.avatar_url,
          },
          thumbnail: {
            url: project.icon_url,
          },
        },
      ],
      username: project.title,
      avatar_url: project.icon_url,
    }
  } else if (content_type === 'json') {
    return { project, version }
  } else if (content_type === 'form') {
    return { project, version }
  }
}

function sendWebhook() {}
