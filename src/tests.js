const modrinth = require('./modrinth')

const webhooks = require('./webhooks')

const database = require('./database')

dbtest()

async function dbtest() {
  database.connect()
}

//test()

async function test() {
  // TODO: Create POST and DELETE client endpoints
  // TODO: make project IDs unique per webhook
  // TODO: Auto scan modrinth with cron
  // TODO: Add curseforge links
  // TODO: Client side form errors
  // TODO: Modrinth project name preview
  const modrinthProject = await modrinth.getProject('lyiXgXNm')

  const modrinthVersion = (await modrinth.getVersions('lyiXgXNm'))[0]

  const { project, version } = await modrinth.formatData({
    modrinthProject,
    modrinthVersion,
  })

  webhooks.send(
    'https://discord.com/api/webhooks/858603951935193108/vVq0V4KwYLQZS6RbFVwY1vlt7M-iedvFMNFePb6gDMeSZ8AwSlo5mxS4IrT64wqfPFJi',
    { project, version },
    'discord',
    {}
  )
}

//test2()

async function test2() {
  console.log(await modrinth.getProject('lyiXgXNm'))
}