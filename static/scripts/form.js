function addProjectIDField() {
  const projectIdFields = document.getElementsByName('project_ids')
  const template = document.getElementById('project_id_field')
  const clone = template.content.cloneNode(true)

  insertAfter(projectIdFields[projectIdFields.length - 1], clone)
}

function createWebhookRequest(form) {
  const webhook = {}
  if (form === 'add') {
    webhook.payload_url = document.getElementById('add_payload_url').value
    webhook.content_type = document.getElementsByName('content_type')[0].value
    webhook.project_ids = [...document.getElementsByName('project_ids')]
      .map((element) => element.value)
      .filter((project_id) => project_id.length > 0)

    webhook.release_type = []
    if (document.getElementsByName('release_type/release')[0].value) {
      webhook.release_type.push('release')
    }
    if (document.getElementsByName('release_type/beta')[0].value) {
      webhook.release_type.push('beta')
    }
    if (document.getElementsByName('release_type/alpha')[0].value) {
      webhook.release_type.push('alpha')
    }

    webhook.mod_loader = []
    if (document.getElementsByName('mod_loader/fabric')[0].value) {
      webhook.mod_loader.push('fabric')
    }
    if (document.getElementsByName('mod_loader/forge')[0].value) {
      webhook.mod_loader.push('forge')
    }

    webhook.additional_data = []
    if (document.getElementsByName('additional_data/description')[0].value) {
      webhook.additional_data.push('description')
    }
    if (document.getElementsByName('additional_data/source_code')[0].value) {
      webhook.additional_data.push('source_code')
    }
    if (document.getElementsByName('additional_data/discord')[0].value) {
      webhook.additional_data.push('discord')
    }
  } else if (form === 'remove') {
    webhook.payload_url = document.getElementById('remove_payload_url').value
  }

  const method = form === 'add' ? 'POST' : 'DELETE'

  send('POST', '/webhook', webhook)
}

function setNextScan() {
  const date = new Date()
  let minutes = 60 - date.getMinutes()

  if (minutes >= 30) {
    minutes -= 30
  }

  next_scan = document.getElementById('next_scan')

  next_scan.innerText = `New versions are found in less than 30 minutes. Checks occur at **:00 and **:30. The next scan is ${
    minutes !== 0 ? 'in ' + minutes + ' minutes' : 'happening right now'
  }.`

  setTimeout(setNextScan, 60000 - date.getSeconds() * 1000 + 100)
}

setNextScan()

// Helpers
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

async function send(method = 'GET', url = '', data = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match 'Content-Type' header
  })
  return response.json() // parses JSON response into native JavaScript objects
}
