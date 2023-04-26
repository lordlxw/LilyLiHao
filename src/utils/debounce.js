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

export const btnHandleColor = (event, disabled) => {
  // const myElementId = document.getElementById(elementId)
  // console.log(myElementId)
  if (event) {
    console.log(1121221)
    // myElementId.style.background = colorVal
    event.currentTarget.disabled = disabled
  }
}
