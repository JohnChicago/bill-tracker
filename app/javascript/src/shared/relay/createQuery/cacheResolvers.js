// @flow
import { pull } from 'lodash'
import type { ConcreteBatch } from 'relay-runtime'
import type { RelayCacheResovler } from '@/types'

// HACK: stop-gap caching solution for paginated data while waiting for relay
// to implement actual caching
const resolvers: Array<RelayCacheResovler> = []

// mutation
export const cacheResolvers = {
  add (resolver: RelayCacheResovler) {
    resolvers.push(resolver)
  },
  remove (resolver: RelayCacheResovler) {
    pull(resolvers, resolver)
  }
}

// access
export function getCacheResolver (operation: ConcreteBatch, variables: Object): ?RelayCacheResovler {
  return resolvers.reduce((memo, resolver) => (
    !memo && resolver.canCacheRequest(operation, variables) ? resolver : memo
  ), null)
}
