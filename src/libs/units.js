// adapted from: https://github.com/MyCryptoHQ/MyCrypto/blob/develop/common/libs/units.ts
import BNJS from 'bn.js'
import { stripHexPrefix } from 'libs/formatters'

export const BN = (small, base = 10) => new BNJS(small.toString(10), base)

// Trim to 3 trailing decimals
export const trimDecimalsThree = n =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

export const ETH_DECIMAL = 18

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000',
}

export const handleValues = input => {
  if (typeof input === 'string') {
    return input.startsWith('0x') ? BN(stripHexPrefix(input), 16) : BN(input)
  }
  if (typeof input === 'number') {
    return BN(input)
  }
  if (BNJS.isBN(input)) {
    return input
  } else {
    throw Error('unsupported value conversion')
  }
}

export const Nonce = input => handleValues(input)
export const Wei = input => handleValues(input)
export const TokenValue = input => handleValues(input)
export const getDecimalFromEtherUnit = key => Units[key].length - 1

export const stripRightZeros = str => {
  const strippedStr = str.replace(/0+$/, '')
  return strippedStr === '' ? null : strippedStr
}

const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const paddedValue = value.padStart(decimal + 1, '0')
  const integerPart = value.slice(0, -decimal)
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal))
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`
}

const convertedToBaseUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const [integerPart, fractionPart = ''] = value.split('.')
  const paddedFraction = fractionPart.padEnd(decimal, '0')
  return `${integerPart}${paddedFraction}`
}

export const fromWei = (wei, unit) => {
  const decimal = getDecimalFromEtherUnit(unit)
  return baseToConvertedUnit(wei.toString(), decimal)
}

export const toWei = (value, decimal) => {
  const wei = convertedToBaseUnit(value, decimal)
  return Wei(wei)
}

// prettier-ignore
export const fromTokenBase = (value, decimal) =>
  baseToConvertedUnit(value.toString(), decimal)

export const toTokenBase = (value, decimal) =>
  TokenValue(convertedToBaseUnit(value.toString(), decimal))

// const convertTokenBase = (value, oldDecimal, newDecimal) => {
//   if (oldDecimal === newDecimal) {
//     return value
//   }
//   return toTokenBase(fromTokenBase(value, oldDecimal), newDecimal)
// }

export const gasPriceToBase = price =>
  toWei(price.toString(), getDecimalFromEtherUnit('gwei'))
