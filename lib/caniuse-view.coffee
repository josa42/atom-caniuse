{SelectListView, TextEditorView, $} = require 'atom'
{exec} = require('child_process')
data = require '../data/data.json'
open = require 'open'

module.exports =
class AtomCaniuseView extends SelectListView
  @content: ->
    @div class: 'select-list', =>
      @subview 'filterEditorView', new TextEditorView(mini: true)
      @div class: 'error-message', outlet: 'error'
      @div class: 'loading', outlet: 'loadingArea', =>
        @span class: 'loading-message', outlet: 'loading'
        @span class: 'badge', outlet: 'loadingBadge'
      @ol class: 'list-group', outlet: 'list'
      @table =>
        @thead outlet: 'head'
        @tbody outlet: 'table'

  getFilterKey: -> 'title'

  initialize: (serializeState) ->
    super
    @addClass('overlay from-top caniuse-view')

  viewForItem: (item) ->
    "<li>#{item.title}</li>"

  confirmed: (item) ->
    open("http://caniuse.com/#feat=#{item.key}");

    @cancel()

  selectItemView: (view) ->

    agentKeys = Object.keys(data.agents)
      .filter (key) ->
        confKey = 'show' + key.replace(/(^|_)([a-z])/g, (m) ->
          m.replace(/^_/, '').toUpperCase()
        )
        return atom.config.get("caniuse.#{confKey}")


    super(view)
    item = @getSelectedItem()

    @head.html('')
    tr = $('<tr>')
    agentKeys
      .forEach (key) ->
        tr.append($('<th>').text(data.agents[key].abbr))
    @head.append(tr)

    @table.html('')

    i = 0
    while true
      tr = $('<tr>')
      agentKeys
        .forEach (key) ->
          agent = data.agents[key]
          v = agent.versions[agent.versions.length - i]

          td = $('<td>').text(v or '')
          support = String(item.stats[key][v]).replace /\s.*/g, ''

          # y - (Y)es, supported by default
          if support is 'y'
            td.addClass('is-supported')

          # a - (A)lmost supported (aka Partial support)

          else if support is 'a'
            td.addClass('is-almost-supported')


          # u - Support (u)nknown
          # x - Requires prefi(x) to work
          # p - No support, but has (P)olyfill
          # n - (N)o support, or disabled by default
          # d - (D)isabled by default (need to enable flag or something)
          else if v
            td.addClass('is-unsupported')

          tr.append(td)

      @table.prepend(tr)

      break unless i++ < 10

  # cancel: -> console.log 'mööp'

  populate: ->

    rows = Object.keys(data.data)
      .map (key) ->
        row = data.data[key]
        row.key = key
        return row

    @setItems rows

  show: ->
    @populate()
    atom.workspaceView.append(this)
    @focusFilterEditor()
