"use babel"

export default {
  caniuseView: null,

  activate(/* state */) {
    atom.commands.add('atom-workspace', {
      'can-i-use:show': () => require('./commands/show')(this),
      'can-i-use:update': () => require('./commands/update')(this)
    })
  },

  config: require('./config')
}
