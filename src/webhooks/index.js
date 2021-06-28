const axios = require('axios').default

module.exports.send = (
  url,
  { project, version },
  content_type,
  config = {}
) => {
  ({ project, version } = applyRowConfig({ project, version }, config))

  const body = createBody({ project, version }, content_type)

  axios({
    method: 'post',
    url: url,
    data: body,
  }).catch(function (error) {
    console.log('Webhook failed to send\n', error.response)
  })
}

function applyRowConfig({ project, version }, config) {
  if (config.hiddenItems) {
    if (config.hiddenItems.includes('description')) {
      delete project.description
    }
    if (config.hiddenItems.includes('source_code')) {
      delete project.links.source_code
    }
    if (config.hiddenItems.includes('discord')) {
      delete project.links.discord
    }
  }
  if (config.additionalItems) {
    if (typeof config.additionalItems.curseforge === 'string') {
      project.links.curseforge = config.additionalItems.curseforge
    }
  }

  return { project, version }
}

function createBody({ project, version }, content_type) {
  let body
  if (content_type === 'discord') {
    body = {
      content: null,
      embeds: [
        {
          title: project.title,
          description: project.description,
          url: project.url,
          color: parseInt(`0x${project.primary_color.substring(1)}`, 16),
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
              name: '<:modrinth:858545795987931166>  Modrinth Download',
              value: `${version.url}\n\n${
                project.links.curseforge
                  ? `<:curseforge:858545795917152266>  [Curseforge](${project.links.curseforge})<:spa:858539949556891649>`
                  : ''
              }${
                project.links.source_code
                  ? `${
                      project.links.source_code.startsWith('https://github.com')
                        ? `<:github:858545795883204608>  [GitHub](`
                        : `<:git:858545795980328970>  [Source Code](`
                    }${project.links.source_code})<:spa:858539949556891649>`
                  : ''
              }${
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
    if (version.changelog) {
      body.embeds[0].fields.splice(2, 0, {
        name: 'Changelog',
        value: version.changelog,
      })
    }
  } else if (content_type === 'json') {
    body = { project, version }
  }

  return body
}
