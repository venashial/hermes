function addProjectIDField() {
  const projectIdFields = document.getElementsByName('project_ids')
  const template = document.getElementById('project_id_field')
  const clone = template.content.cloneNode(true)

  insertAfter(projectIdFields[projectIdFields.length - 1], clone)
}

async function createWebhookRequest(form) {
  const webhook = {}
  if (form === 'add') {
    webhook.payload_url = document.getElementById('add_payload_url').value
    webhook.content_type = document.getElementsByName('content_type')[0].value
    webhook.project_ids = [...document.getElementsByName('project_ids')]
      .map((element) => element.value)
      .filter((project_id) => project_id.length > 0)

    webhook.config = {}
    webhook.config.filter = {}

    webhook.config.filter.version_type = []
    if (document.getElementsByName('version_type/release')[0].checked) {
      webhook.config.filter.version_type.push('release')
    }
    if (document.getElementsByName('version_type/beta')[0].checked) {
      webhook.config.filter.version_type.push('beta')
    }
    if (document.getElementsByName('version_type/alpha')[0].checked) {
      webhook.config.filter.version_type.push('alpha')
    }

    webhook.config.filter.mod_loader = []
    if (document.getElementsByName('mod_loader/fabric')[0].checked) {
      webhook.config.filter.mod_loader.push('fabric')
    }
    if (document.getElementsByName('mod_loader/forge')[0].checked) {
      webhook.config.filter.mod_loader.push('forge')
    }

    webhook.config.hiddenItems = []

    if (!document.getElementsByName('additional_data/author')[0].checked) {
      webhook.config.hiddenItems.push('author')
    }
    if (!document.getElementsByName('additional_data/description')[0].checked) {
      webhook.config.hiddenItems.push('description')
    }
    if (!document.getElementsByName('additional_data/source_code')[0].checked) {
      webhook.config.hiddenItems.push('source_code')
    }
    if (!document.getElementsByName('additional_data/discord')[0].checked) {
      webhook.config.hiddenItems.push('discord')
    }
  } else if (form === 'remove') {
    webhook.payload_url = document.getElementById('remove_payload_url').value
  }

  const method = form === 'add' ? 'POST' : 'DELETE'

  const response = await send(method, '/api/webhook', webhook)

  updateMessage(response.ok, await response.text())

  if (response.ok) {
    clearForm(form)
  }
}

async function send(method = 'GET', url = '', data = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response
}

function updateMessage(ok, message) {
  if (ok) {
    document.getElementById('message').classList = 'card message ok fade-in'
  } else {
    document.getElementById('message').classList = 'card message error fade-in'
  }

  if (message[0] === '{') {
    message = 'Server error, ' + (JSON.parse(message)).message
  }

  document.getElementById('message-text').innerText = message

  location.hash = '#message-anchor'

  setTimeout(() => {
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    )
  }, 800)

  document.getElementById('message').style.display = 'flex'
}

function clearForm(form) {
  if (form === 'add') {
    document.getElementById('add_payload_url').value = ''
    document.getElementsByName('content_type')[0].value = 'discord'
    const project_ids = document.getElementsByName('project_ids')

    project_ids.forEach((project_id, index) => {
      if (index != 0) {
        project_id.remove()
      } else{
        project_id.value = ''
      }
    })

    document.getElementsByName('version_type/release')[0].checked = true
    document.getElementsByName('version_type/beta')[0].checked = true
    document.getElementsByName('version_type/alpha')[0].checked = true
    document.getElementsByName('mod_loader/fabric')[0].checked = true
    document.getElementsByName('mod_loader/forge')[0].checked = true
    document.getElementsByName('additional_data/author')[0].checked = true
    document.getElementsByName('additional_data/description')[0].checked = true
    document.getElementsByName('additional_data/source_code')[0].checked = true
    document.getElementsByName('additional_data/discord')[0].checked = true
  } else if (form === 'remove') {
    document.getElementById('remove_payload_url').value = ''
  }
}

// Next scan countdown
function setNextScan() {
  const date = new Date()
  let minutes = 60 - date.getMinutes()

  if (minutes >= 30) {
    minutes -= 30
  }

  next_scan = document.getElementById('next_scan')

  next_scan.innerHTML = `New versions are found in less than 30 minutes. Checks occur at **:00 and **:30. The next scan is ${
    minutes !== 0 ? 'in ' + minutes + ' minutes' : 'happening right now'
  }. <br />*If present on Modrinth project.`

  setTimeout(setNextScan, 60000 - date.getSeconds() * 1000 + 100)
}

setNextScan()

// Helpers
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}
