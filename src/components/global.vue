<script>
let userInfo = {};
function getUser(key) {
  return key ? userInfo[key] : userInfo;
}

function setUser(key, data) {
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
</script>