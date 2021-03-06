import './styles.scss'

// libraries
import React, { Component } from 'react'
import { connect } from 'kea/logic'

// utils

// components
import Spinner from 'lib/tags/spinner'
import Connection from './connection'
import AddConnection from './add-connection'

// logic
import connections from '~/scenes/connections/logic'

// const { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } = connections.constants

@connect({
  props: [
    connections, [
      'isLoading',
      'sortedConnections'
    ]
  ]
})
export default class ConnectionsScene extends Component {
  render () {
    const { isLoading, sortedConnections } = this.props

    return (
      <div className='connections-scene'>
        {isLoading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div>
            {sortedConnections.length === 0 ? (
              <div style={{marginBottom: 20}}>
                You have not configured any connections. Add one below.
              </div>
            ) : sortedConnections.map(connection => (
              <Connection key={connection._id} connection={connection} />
            ))}
            <AddConnection />
          </div>
        )}
      </div>
    )
  }
}
