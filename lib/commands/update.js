'use babel'

import loadData from '../utils/load-data'

function setType (notification, type, message) {
  notification.type = type
  notification.message = message

  let element = atom.views.getView(notification)

  element.render()
  element.autohide()
}

export default function commandUpdate (pkg) {
  let notification = atom.notifications.addInfo('Updating "Can I use" data', {
    dismissable: true
  })

  loadData(true)
    .then(() => setType(notification, 'success', 'Updated "Can I use" data'))
    .catch(() => setType(notification, 'error', 'Updating "Can I use" failed'))
}
