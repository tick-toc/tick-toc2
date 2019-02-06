import {red, white, yellow, blue, black} from './util'

export const wireCount = ['3', '4', '5', '6']

export const wireCountCases = {
  '3': [
    {
      colors: [red, white, blue],
      correct: 2
    },
    {
      colors: [red, blue, red],
      correct: 2
    },
    {
      colors: [white, white, blue],
      correct: 1
    },
    {
      colors: [blue, blue, red],
      correct: 1
    },
    {
      colors: [blue, white, white],
      correct: 1
    },
    {
      colors: [blue, red, white],
      correct: 2
    }
  ]
  // '4': [
  //   {
  //     colors: [blue, red, white],
  //     correct: 2
  //   }
  // ],
  // '5': [],
  // '6': []
}
