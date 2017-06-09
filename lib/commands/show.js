'use babel'

import CaniuseView from '../caniuse-view'

export default function commandShow (pkg) {
  if (!pkg.caniuseView) {
    pkg.caniuseView = new CaniuseView()
  }
  pkg.caniuseView.show()
}
