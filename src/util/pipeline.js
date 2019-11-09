/**
 * @prettier
 */

import { flow } from 'lodash/fp'

export const pipeline = (input, ...args) => flow(...args)(input)
