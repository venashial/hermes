const axios = require('axios').default

const Vibrant = require('node-vibrant')

// Get multiple projects at once
module.exports.getProjects = async (project_ids) => {
  const projects = (
    await axios.get(
      'https://api.modrinth.com/api/v1/mods?ids=' + JSON.stringify(project_ids)
    )
  ).data

  const found = projects.map((project) => project.id)

  const missing = project_ids.filter(
    (project_id) => !found.includes(project_id)
  )

  return { projects, missing }
}

// Get one project
module.exports.getProject = async (project_id) => {
  return (
    await axios.get('https://api.modrinth.com/api/v1/mod/' + project_id)
  ).data
}

// Get versions of a project
module.exports.getVersions = async (project_id) => {
  return (
    await axios.get(`https://api.modrinth.com/api/v1/mod/${project_id}/version`)
  ).data
}

// Get owner of team
module.exports.formatData = async ({ modrinthProject, modrinthVersion }) => {
  const author = await module.exports.getOwner(modrinthProject.team)

  const primary_color = await findPrimaryColor(modrinthProject.icon_url)

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
    primary_color,
    author,
  }

  const version = {
    name: modrinthVersion.name,
    changelog: modrinthVersion.changelog,
    version_type: modrinthVersion.version_type,
    game_versions: modrinthVersion.game_versions,
    loaders: modrinthVersion.loaders,
    url: `${project.url}/version/${modrinthVersion.id}`,
  }

  return { project, version }
}

// Get owner of team
module.exports.getOwner = async (team_id) => {
  const team = (
    await axios.get(`https://api.modrinth.com/api/v1/team/${team_id}/members`)
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

/*
Non-exports
*/

// Find primary color in image
async function findPrimaryColor(url) {
  return (await Vibrant.from(url).getPalette()).Vibrant.getHex()
}