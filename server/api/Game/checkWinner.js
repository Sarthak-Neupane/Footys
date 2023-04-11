const checkWinner = (A, arr_size, sum) => {
  for (let i = 0; i < arr_size - 2; i++) {
    let s = new Set()
    let curr_sum = sum - A[i]
    for (let j = i + 1; j < arr_size; j++) {
      if (s.has(curr_sum - A[j])) {
        return true
      }
      s.add(A[j])
    }
  }
  return false
}

export default defineEventHandler(async query => {
  const body = await readBody(query)
  const value = body.value
  if (value.length < 3) return { result: false}
  let gridNumbers = []

  value.forEach((item, index) => {
    if(item.player === body.player ){
        gridNumbers.push(item.gridNumber)
    }
  })
  const arr_size = gridNumbers.length;
  const sum = 15;
  const result = checkWinner(gridNumbers, arr_size, sum);

  return {
    result: result
  }
})
