import { fromJS } from 'immutable'

import {
  LOGIN_ERROR,
  // CONTRACT_ERROR,
  SET_WALLET,
  SET_CONTRACTS,
  UPDATE_BALANCES,
  REQUEST_MODAL_METHOD,
  NEW_ARRAY,
  CHANGE_ITEMS,
  DELETE_LISTINGS,
  SEND_TRANSACTION,
} from '../actions/constants'

const initialState = fromJS({
  ethjs: {},
  account: '',
  networkID: '',
  balances: {
    ETH: '0',
    token: '0',
    registryAllowance: '0',
    votingAllowance: '0',
    votingRights: '0',
    lockedTokens: '0',
    claimableReward: '0',
  },
  contracts: {
    registry: {},
    token: { name: '' },
    voting: {},
    parameterizer: {},
  },
  parameters: { minDeposit: '', applyStageLen: '' },
  listings: {},
  txnStatus: false,
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    // case LOGIN_ERROR:
    //   return state.set('error', action.error)
    // case CONTRACT_ERROR:
    //   return state.setIn(['error', 'type'], true)
    case SEND_TRANSACTION:
      return state.set('txnStatus', fromJS(true))
    case SET_WALLET:
      return state
        .set('error', fromJS(false))
        .set('ethjs', fromJS(action.payload.ethjs))
        .set('account', fromJS(action.payload.account))
        .set('networkID', fromJS(action.payload.networkID))
    case SET_CONTRACTS:
      return state
        .set('parameters', fromJS(action.payload.parameters))
        .set('contracts', fromJS(action.payload.contracts))
        .set('miningStatus', fromJS({ open: true, message: 'mining Status message' }))
    case UPDATE_BALANCES:
      return state
        .set('balances', fromJS(action.payload.balances))
    case REQUEST_MODAL_METHOD:
      return state.set('request', fromJS(action.payload))
    case NEW_ARRAY:
      return replaceListings(state, action.payload)
    case CHANGE_ITEMS:
      return changeListings(state, action.payload)
    case DELETE_LISTINGS:
      return deleteObjectInArray(state, action.payload)
    default:
      return state
  }
}

function replaceListings(state, payload) {
  const filteredPayload = payload.reduce((acc, val) => {
    return acc.filter(a => a.listingHash !== val.listingHash)
  }, [])
  return state.set('listings', fromJS(filteredPayload))
}

function changeListings(state, payload) {
  const newListings = payload.reduce((acc, val) => {
    const index = acc.findIndex(ri => ri.get('listingHash') === val.listingHash)
    // New listing
    if (index === -1) {
      return acc.push(fromJS(val))
    }
    // Check to see if the event is the more recent
    if (val.latest.blockNumber > acc.getIn([index, 'latest', 'blockNumber'])) {
      return acc.setIn([index, 'latest'], fromJS(val.latest))
    }
    // Not unique, not more recent, return List
    return acc
  }, state.get('listings'))

  const listings = state.get('listings')
  if (newListings.isSubset(listings)) {
    return state
  }
  // Replace entire List
  return state.set('listings', newListings)
}

function deleteObjectInArray(array, payload) {
  const index = array.findIndex(
    ri =>
      ri.get('listingHash') === payload
  )
  if (index !== -1) {
    return array.delete(index)
  }
  return array
}

export default homeReducer
