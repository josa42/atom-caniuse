CaniuseView = require './caniuse-view'

module.exports =
  caniuseView: null

  configDefaults:
    showIe: true
    showFirefox: true
    showChrome: true
    showSafari: true
    showOpera: false
    showIosSaf: true
    showOpMini: false
    showAndroid: true
    showOpMob: false
    showBb: false
    showAndChr: true
    showAndFf: false
    showIeMob: false
    showAndUc : false

  activate: (state) ->
    atom.workspaceView.command 'caniuse:show', =>
      @caniuseView = new CaniuseView(state.atomCaniuseViewState)
      @caniuseView.show()

  serialize: ->
    caniuseViewState: @caniuseView.serialize()
