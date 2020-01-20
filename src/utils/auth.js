import Cookies from 'js-cookie'

const TokenKey = 'accessToken'
const NameKey = 'username'
const UserId = 'userId'
const UserScore = 'userScore'
const UserAvatar = 'avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: 1})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getName() {
  return Cookies.get(NameKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name, {expires: 1})
}

export function removeName() {
  return Cookies.remove(NameKey)
}

export function getAvatar() {
  return Cookies.get(UserAvatar)
}

export function setAvatar(avatar) {
  return Cookies.set(UserAvatar, avatar, {expires: 1})
}

export function removeAvatar() {
  return Cookies.remove(UserAvatar)
}


export function setUserId(userId) {
  return Cookies.set(UserId, userId, {expires: 1})
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}


export function setScore(score) {
  return Cookies.set(UserScore, score, {expires: 1})
}

export function getScore() {
  return Cookies.get(UserScore)
}

export function removeScore() {
  return Cookies.remove(UserScore)
}
