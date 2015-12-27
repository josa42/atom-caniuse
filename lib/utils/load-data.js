"use babel"

import request from 'request'

UPDATE_URL = 'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json'
DAY = 1000 * 60 * 60 * 24

function requestData() {
  return new Promise((resolve, reject) => {
    request(UPDATE_URL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error || new Error('Unknown error'))
      }
    })
  })
}

function updateData() {
  return requestData()
    .then((data) => {
      persistData(data)
      return data
    })
}

function persistData(data) {
  localStorage['caniuse:updated_at'] = new Date()
  localStorage['caniuse:data'] = JSON.stringify(data)
}

function restoreData() {
  return new Promise((resolve, reject) => {

    let updatedAt = localStorage['caniuse:updated_at']
    let inverval = atom.config.get('caniuse.updateDataInterval') * DAY

    if (!updatedAt || (new Date() - new Date(updatedAt)) > inverval) {
      return resolve()
    }

    resolve(JSON.parse(localStorage['caniuse:data']))
  })
}

export default function loadData(forceReload = false) {

  return restoreData()
    .then(data => {
      if (!forceReload && data) { return data }
      return updateData()
    })
}
