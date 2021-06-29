const axios = require('axios').default

module.exports.send = async (
  url,
  { project, version },
  content_type,
  config
) => {
  if ((version.loaders.length == 2 || config.filter.mod_loader.includes(version.loaders[0])) && config.filter.version_type.includes(version.version_type)) {
    const body = createBody({ project, version }, content_type, config)

    await axios({
      method: 'post',
      url: url,
      data: body,
    }).catch(function (error) {
      console.log('Webhook failed to send\n', error.response)
    })
  }
}

module.exports.applyRowConfig = ({ project, version }, config) => {
  if (config.hiddenItems) {
    if (config.hiddenItems.includes('author')) {
      delete project.author
    }
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

function createBody({ project, version }, content_type, config) {
  let body
  if (content_type === 'discord') {
    body = {
      content: null,
      embeds: [
        {
          title: `${project.title}${
            config.filter.mod_loader.length == 1 &&
            config.filter.version_type.length == 1
              ? ''
              : config.filter.mod_loader.length == 1 &&
                config.filter.version_type.length != 1
              ? ` (${version.version_type})`
              : config.filter.version_type.length == 1
              ? ` (${version.loaders.join(' & ') + ' '})`
              : ` (${version.loaders.join(' & ') + ' '} ${version.version_type})`
          }`,
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
          thumbnail: {
            url: project.icon_url,
          },
          timestamp: version.date,
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
    if (project.description) {
      body.embeds[0].description = project.description
    }
    if (project.author) {
      body.embeds[0].author = {
        name: project.author.username,
        url: project.author.url,
        icon_url: project.author.avatar_url,
      }
    }
  } else if (content_type === 'json') {
    body = { project, version }
  }

  return body
}
