export const generateRandomIndex = number => {
  if (typeof number !== 'number') parseInt(number)
  return Math.floor(Math.random() * number)
}

export const sortByKey = (a, b, key) => {
  if (a[key] < b[key]) return -1
  else if (a[key] > b[key]) return 1
  else return 0
}
