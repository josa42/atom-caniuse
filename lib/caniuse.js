'use babel'

import { CompositeDisposable } from 'atom'

export default {
  caniuseView: null,

  config: require('./config'),

  activate (/* state */) {
    this.disposables = new CompositeDisposable()

    this.disposables.add(atom.commands.add('atom-workspace', {
      'can-i-use:show': () => require('./commands/show')(this),
      'can-i-use:update': () => require('./commands/update')(this)
    }))
  },

  deactivate () {
    this.disposables.dispose()
  }
}
