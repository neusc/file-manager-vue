let userInfo = {};
function getUser(key?: string) {
  return key ? userInfo[key] : userInfo;
}

function setUser(key: string, data: object) {
  userInfo[key] = data;
}

function clear() {
  userInfo = {};
}
export default {
  getUser,
  setUser,
  clear
};
