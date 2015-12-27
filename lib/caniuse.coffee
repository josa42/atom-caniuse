CaniuseView = require './caniuse-view'
loadData = require './utils/load-data'

isJsonString = (str) ->
  try
    JSON.parse str
    return yes
  return no


module.exports =
  caniuseView: null

  activate: (state) ->
    atom.commands.add 'atom-workspace',
      'can-i-use:show': =>
        @caniuseView ?= new CaniuseView()
        @caniuseView.show()

    atom.commands.add 'atom-workspace',
      'can-i-use:update', =>
        loadData()
          .then(() =>
            if @caniuseView
              @caniuseView.populate()
          )
          .catch(() =>
            if @caniuseView
              @caniuseView.setError 'Loading data failed!'
          )

  config:
    updateDataInterval:
      description: 'Update data if older than (days)'
      type: 'number'
      default: 7
    showIe:
      title: 'Show IE'
      type: 'boolean'
      default: true
    showFirefox:
      type: 'boolean'
      default: true
    showChrome:
      type: 'boolean'
      default: true
    showSafari:
      type: 'boolean'
      default: true
    showOpera:
      type: 'boolean'
      default: false
    showIosSaf:
      title: 'Show iOS Safari'
      type: 'boolean'
      default: true
    showOpMini:
      title: 'Show Opera Mini'
      type: 'boolean'
      default: false
    showAndroid:
      title: 'Show Android Browser'
      type: 'boolean'
      default: true
    showOpMob:
      title: 'Show Opera Mobile'
      type: 'boolean'
      default: false
    showBb:
      title: 'Show Blackberry Browser'
      type: 'boolean'
      default: false
    showAndChr:
      title: 'Show Chrome for Android'
      type: 'boolean'
      default: true
    showAndFf:
      title: 'Show Firefox for Android'
      type: 'boolean'
      default: false
    showIeMob:
      title: 'Show IE Mobile'
      type: 'boolean'
      default: false
    showAndUc:
      title: 'Show UC Browser for Android'
      type: 'boolean'
      default: false
