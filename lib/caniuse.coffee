CaniuseView = require './caniuse-view'

module.exports =
  caniuseView: null
  config:
    showIe:
      title: 'Show IE'
      type:'boolean'
      default: true
    showFirefox:
      type:'boolean'
      default: true
    showChrome:
      type:'boolean'
      default: true
    showSafari:
      type:'boolean'
	  default: true
    showOpera:
      type:'boolean'
      default: false
    showIosSaf:
      title: 'Show iOS Safari'
      type:'boolean'
      default: true
    showOpMini:
      title: 'Show Opera Mini'
      type:'boolean'
      default: false
    showAndroid:
      title: 'Show Android Browser'
      type:'boolean'
      default: true
    showOpMob:
      title: 'Show Opera Mobile'
      type:'boolean'
      default: false
    showBb:
      title: 'Show Blackberry Browser'
      type:'boolean'
      default: false
    showAndChr:
      title: 'Show Chrome for Android'
      type:'boolean'
      default: true
    showAndFf:
      title: 'Show Firefox for Android'
      type:'boolean'
      default: false
    showIeMob:
      title: 'Show IE Mobile'
      type:'boolean'
      default: false
    showAndUc:
      title: 'Show UC Browser for Android'
      type:'boolean'
      default: false

  activate: (state) ->
    atom.workspaceView.command 'caniuse:show', =>
      @caniuseView = new CaniuseView(state.atomCaniuseViewState)
      @caniuseView.show()

  serialize: ->
    caniuseViewState: @caniuseView.serialize()
