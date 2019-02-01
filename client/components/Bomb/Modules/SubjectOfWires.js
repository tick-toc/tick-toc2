import {MeshPhongMaterial} from 'three'

/*******************
COLORS
*******************/

export const red = new MeshPhongMaterial({
  color: 0xff0000,
  shininess: 100
})

const white = new MeshPhongMaterial({
  color: 0xffffff,
  shininess: 100
})

export const black = new MeshPhongMaterial({
  color: 0x000000,
  shininess: 100
})

export const copper = new MeshPhongMaterial({
  color: 0xaa7755,
  shininess: 100
})

const blue = new MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100
})

export const yellow = new MeshPhongMaterial({
  color: 0xffff00,
  shininess: 100
})

export const defaultMaterial = new MeshPhongMaterial({
  color: 0xaaaab4,
  shininess: 100
})
export const cubeMaterial = new MeshPhongMaterial({
  color: 0x4c4e5b,
  shininess: 100
})
export const socketMaterial = new MeshPhongMaterial({
  color: 0x4c4e5b,
  shininess: 10
})

export const buttonMaterial = new MeshPhongMaterial({
  color: 0xccbbaa,
  shininess: 100
})

/*******************
LOGIC
*******************/

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
  // '4': [],
  // '5': [],
  // '6': []
}
