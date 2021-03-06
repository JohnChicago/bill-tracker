// @flow
import React, { Component } from 'react'
import Clipboard from 'react-copy-to-clipboard'
import { Link } from './Link'
import { events } from '@/events'
import { stylesheet } from '@/styles'

export class CopyLink extends Component {
  props: {
    value: string
  }

  // events
  didCopyValue = (text: string) => {
    events.emit(events.showNotification, {
      key: 'copy-link',
      message: 'Copied link to clipboard ✔'
    })
  }

  // lifecycle
  render () {
    const { value } = this.props
    return <Clipboard text={value} onCopy={this.didCopyValue}>
      <Link styles={rules.link} onClick={() => {}}>
        <span>Copy Link</span>
      </Link>
    </Clipboard>
  }
}

const rules = stylesheet({
  link: {
    '> .fa': {
      marginRight: 5
    }
  }
})
