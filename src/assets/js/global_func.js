const loginShow = (callback) => {
  document.getElementById('authorForm').style.display = 'block'

  if (callback instanceof Function) {
    callback()
  }
}

const loginHide = (callback) => {
  document.getElementById('authorForm').style.display = 'none'
  if (callback instanceof Function) {
    callback()
  }
}

export default {
  loginShow,
  loginHide
}
