// Bomb source
// 410 - 471 mod loader
// 738 - 782 onDocumentMouseDown

export const mazeCases = {
  '1': {
    CircleOne: 'Pos21',
    CircleTwo: 'Pos36',
    Maze: [
      [[1, 2], [1, 3], [2, 3], [1, 2], [1, 3], [3]],
      [[0, 2], [1, 2], [0, 3], [0, 1], [1, 3], [2, 3]],
      [[0, 2], [0, 1], [2, 3], [1, 2], [1, 3], [2, 3]],
      [[0, 2], [1], [0, 1], [0, 3], [1], [0, 2, 3]],
      [[0, 1, 2], [1, 3], [2, 3], [1, 2], [3], [0, 2]],
      [[0, 1], [3], [0, 1], [0, 3], [1], [0, 3]]
    ]
  },
  '2': {},
  '3': {},
  '4': {},
  '5': {},
  '6': {}
}

export const CreateCellCheck = array => {
  const newCell = {}
  newCell.GoUp = array.includes(0)
  newCell.GoRight = array.includes(1)
  newCell.GoDown = array.includes(2)
  newCell.GoLeft = array.includes(3)
  newCell.array = array
  return newCell
}

const maze1 = [
  [[1, 2], [1, 3], [2, 3], [1, 2], [1, 3], [3]],
  [[0, 2], [1, 2], [0, 3], [0, 1], [1, 3], [2, 3]],
  [[0, 2], [0, 1], [2, 3], [1, 2], [1, 3], [2, 3]],
  [[0, 2], [1], [0, 1], [0, 3], [1], [0, 2, 3]],
  [[0, 1, 2], [1, 3], [2, 3], [1, 2], [3], [0, 2]],
  [[0, 1], [3], [0, 1], [0, 3], [1], [0, 3]]
]

export function CanMove(position, mazeCase, desiredDirection) {
  console.log('position', position)

  const currentPositionRules =
    mazeCases[mazeCase].Maze[position[0] - 1][position[1] - 1]

  const positionRules = CreateCellCheck(currentPositionRules)
  console.log(positionRules[desiredDirection])

  // return positionRules[desiredDirection]
  // console.log('Position: ', position)

  console.log('positionRules: ', positionRules)

  return true
}

const positionHashTable = {
  GoUp: 0,
  GoRight: 1,
  GoDown: 2,
  GoLeft: 3
}
