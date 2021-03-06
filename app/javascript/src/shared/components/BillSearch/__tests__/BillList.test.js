/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { defaultsDeep } from 'lodash'
import { BillList } from '../BillList'
import { session } from '@/storage'

const { anything } = expect

// subject
let subject

const defaults = {
  animated: true,
  pageSize: 20,
  viewer: {
    bills: {
      count: 2,
      edges: [{ node: { id: 1 } }, { node: { id: 2 } }]
    }
  },
  history: {
    action: 'PUSH'
  },
  relay: {
    hasMore: jest.fn(() => true),
    loadMore: jest.fn(),
    isLoading: jest.fn(() => false)
  }
}

function loadSubject (props = {}, options = { disableLifecycleMethods: true }) {
  subject = shallow(<BillList {...defaultsDeep(props, defaults)} />, options)
}

// specs
afterEach(() => {
  subject = null
})

describe('#state', () => {
  it('enables animations by default', () => {
    loadSubject()
    expect(subject).toHaveState('disablesAnimation', false)
  })

  it('disables animations on pop', () => {
    loadSubject({
      history: { action: 'POP' }
    })

    expect(subject).toHaveState('disablesAnimation', true)
  })
})

describe('#componentDidMount', () => {
  it('re-enables animations on pop', () => {
    loadSubject({
      history: { action: 'POP' }
    }, {
      disableLifecycleMethods: false
    })

    expect(subject).toHaveState('disablesAnimation', false)
  })
})

describe('#componentWillUnmount', () => {
  it('stores the visible bill count', () => {
    const bills = [{ id: 1 }, { id: 2 }, { id: 3 }]

    loadSubject({
      viewer: {
        bills: {
          edges: bills.map((node) => ({ node }))
        }
      }
    })

    subject.unmount()
    expect(session.get('last-search-count')).toEqual(`${bills.length}`)
  })
})

describe('#render', () => {
  it('shows the list', () => {
    loadSubject()
    expect(subject).toMatchSnapshot()
  })

  it('hides the load more button when there is no page size', () => {
    loadSubject({ pageSize: null })
    expect(subject).toMatchSnapshot()
  })
})

describe('clicking load more', () => {
  it('loads another page', () => {
    loadSubject()
    subject.instance().didClickLoadMore()
    expect(defaults.relay.loadMore).toHaveBeenCalledWith(20, anything())
  })

  it('does nothing if there this is the last page', () => {
    defaults.relay.hasMore.mockReturnValue(false)
    loadSubject()
    subject.instance().didClickLoadMore()
    expect(defaults.relay.loadMore).not.toHaveBeenCalled()
  })

  it('does nothing when already loading', () => {
    defaults.relay.isLoading.mockReturnValue(true)
    loadSubject()
    subject.instance().didClickLoadMore()
    expect(defaults.relay.loadMore).not.toHaveBeenCalled()
  })
})
