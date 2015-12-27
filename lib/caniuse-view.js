"use babel"

import { SelectListView, TextEditorView, $ } from 'atom-space-pen-views'
import { markdown } from 'markdown'
import open from 'open'
// import { atom } from 'atom'
import loadData from './utils/load-data'

// infos =
//   y: 'Yes, supported by default'
//   a: 'Almost supported (aka Partial support)'
//   u: 'Support unknown'
//   x: 'Requires prefix to work'
//   p: 'No support, but has Polyfill'
//   n: 'No support, or disabled by default'
//   d: 'Disabled by default (need to enable flag or something)'



const supportClasses = {
  // y - (Y)es, supported by default
  y: 'is-supported',
  // a - (A)lmost supported (aka Partial support)
  a: 'is-almost-supported',
  // x - Requires prefi(x) to work
  x: 'requires-prefix'
  // u - Support (u)nknown
  // p - No support, but has (P)olyfill
  // n - (N)o support, or disabled by default
  // d - (D)isabled by default (need to enable flag or something)
}

class AtomCaniuseView extends SelectListView {

  constructor() {
    super()
    this.data = null

    this.panel = atom.workspace.addModalPanel({ item: this, visible: false })
    this.addClass('caniuse-view')
  }

  static content() {
    this.div({ class: 'select-list no-data' }, () => {
      this.subview('filterEditorView', new TextEditorView({ mini: true }))
      this.div({ class: 'error-message', outlet: 'error' })
      this.div({ class: 'loading', outlet: 'loadingArea' }, () => {
        this.span({ class: 'loading-message', outlet: 'loading' })
        this.span({ class: 'badge', outlet: 'loadingBadge' })
      })
      this.ol({ class: 'list-group', outlet: 'list' })
      this.table(() => {
        this.thead({ outlet: 'head' })
        this.tbody({ outlet: 'table' })
      })
      this.div({ class: 'notes', outlet: 'notes' })
    })
  }

  getFilterKey() {
    return 'title'
  }

  viewForItem(item) {
    return `<li>${item.title}</li>`
  }

  confirmed(item) {
    open(`http://caniuse.com/#feat=${item.key}`)
    this.cancel()
  }

  selectItemView(view) {
    super.selectItemView(view)

    let agentKeys = Object.keys(this.data.agents)
      .filter((key) => {
        const confKey = `show_${key}`.replace(/_([a-z])/g, (m) => {
          return m.replace(/^_/, '').toUpperCase()
        })
        return atom.config.get(`caniuse.${confKey}`)
      })

    const item = this.getSelectedItem()

    this.head.html('')

    const tr = $('<tr>')
    const countCls = `agents-count-${agentKeys.length}`

    agentKeys
      .forEach((key) => {
        tr.append($('<th>')
          .text(this.data.agents[key].abbr))
          .addClass(countCls)
      })

    this.head.append(tr)
    this.table.html('')

    let needNotes = []

    let i = 0
    do {
      const tr = $('<tr>')

      agentKeys.forEach((key) => {
        const agent = this.data.agents[key]
        const version = agent.versions[agent.versions.length - i] || ''
        if (!version) { return }

        let support = String(item.stats[key][version])
        const td = $('<td>').text(version)

        const hasNote = support.match(/\s#(\d+)$/)
        if (hasNote) {
          td.append($('<span>').text(hasNote[1]))
          support = support.replace(/\s#(\d+)$/g, '')
          needNotes.push(hasNote[1])
        }

        const classes = support
          .split(/\s/g)
          .map((supportKey) => supportClasses[supportKey] || '')
          .filter(supportClass => supportClass)

        if (version && classes.length === 0) {
          classes.push('is-unsupported')
        }

        td.addClass(classes.join(' '))

        tr.append(td)
      })

      this.table.prepend(tr)
    } while (i++ < 10)

    let notes = []
    if (item.notes) { notes.push(markdown.toHTML(item.notes)) }

    const notesByNumber = Object.keys(item.notes_by_num)
      .filter((i) => needNotes.indexOf(i) !== -1)
      .map((i) => `<p class="number"><span>${i}</span></p>` + markdown.toHTML(`${item.notes_by_num[i]}`))

    if (notesByNumber.length) {
      notes = notes.concat(notesByNumber)
    }

    this.notes
      .html('')
      .append(notes)
  }

  populateList() {
    super.populateList()
    if (this.list.is(':empty')) {
      this.head.empty()
      this.table.empty()
      this.notes.empty()
    }
  }

  populate() {

    this.setLoading('Loading data...')
    this.data = null

    loadData()
      .then((data) => {
        this.data = data
        this.removeClass('no-data')
        this.setItems(Object.keys(this.data.data)
          .map((key) => $.extend({ key }, this.data.data[key]))
          .sort((a, b) => a.title.localeCompare(b.title)))
      })
      .catch((error) => {
        console.error(error.stack)
        this.setError('Loading data failed!')
        this.addClass('no-data')
      })
  }

  show() {
    this.populate()
    this.panel.show()
    this.focusFilterEditor()
  }

  cancel() {
    this.panel.hide()
  }
}

export default AtomCaniuseView
