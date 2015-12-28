"use babel"

import loadData from '../utils/load-data'

export default function commandUpdate(pkg) {
  loadData()
    .then(() => {
      if (pkg.caniuseView) { pkg.caniuseView.populate() }
    })
    .catch(() => {
      if (pkg.caniuseView) { pkg.caniuseView.setError('Loading data failed!') }
    })

}
