// @flow
import * as React from 'react'
import { stylesheet, mixins } from '@/styles'

type Props = {
  title: string,
  children?: any
}

export function HelpQuestion ({ title, children }: Props) {
  return (
    <div {...rules.question}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

const rules = stylesheet({
  question: {
    ...mixins.borders.low(['top']),
    marginTop: 15,
    paddingTop: 15,
    '> h3': {
      marginBottom: 10
    }
  },
  icon: {
    marginRight: 5
  }
})
