import Saga from 'kea/saga'
import { put, call } from 'redux-saga/effects'
import { LOCATION_CHANGE, push } from 'react-router-redux'

import { waitUntilLogin } from '~/scenes/auth'

import client from '~/client'

import structureLogic from '~/scenes/structure/logic'

const connectionsService = client.service('api/connections')
const structureService = client.service('api/structure')

export default class StructureSaga extends Saga {
  actions = () => ([
    structureLogic, [
      'startLoading',
      'connectionLoaded',
      'structureLoaded',
      'openConnections'
    ]
  ])

  takeEvery = ({ actions }) => ({
    [LOCATION_CHANGE]: this.setStructureFromUrl,
    [actions.openConnections]: this.openConnectionsWorker
  })

  run = function * () {
    yield call(waitUntilLogin)
    yield call(this.setStructureFromUrl)
  }

  setStructureFromUrl = function * (action) {
    const { startLoading, connectionLoaded, structureLoaded } = this.actions

    yield put(startLoading())

    const pathname = window.location.pathname
    const match = pathname.match(/\/connections\/([A-Za-z0-9]+)\/?/)
    const urlConnectionId = match ? match[1] : null

    if (urlConnectionId) {
      const connection = yield connectionsService.get(urlConnectionId)
      const structure = yield structureService.get(urlConnectionId)

      yield put(connectionLoaded(connection))
      yield put(structureLoaded(structure))
    }
  }

  openConnectionsWorker = function * (action) {
    yield put(push('/connections'))
  }
}
