export const debounce = (fn, delay = 300) => {
  let timeId = null
  return function () {
    let context = this
    if (timeId) { clearTimeout(timeId) }
    timeId = setTimeout(() => {
      fn.apply(context, arguments)
      timeId = null
    }, delay)
  }
}
