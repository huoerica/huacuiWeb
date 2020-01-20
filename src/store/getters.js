const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  layoutWidth: state => state.app.layoutWidth,
  loginRegister: state => state.app.loginRegister,
  searchName:  state => state.app.searchName,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userId: state => state.user.userId,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  userScore: state => state.user.userScore,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  orderInfo: state => state.order.orderInfo
}
export default getters
