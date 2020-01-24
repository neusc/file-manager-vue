<template>
  <div id="sign-up">
    <div class="box-content">
      <h1 class="box-title">Hello, Spider Man</h1>
      <el-form ref="form" :model="formData" label-width="80px" size="medium">
        <el-form-item label="username">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="password">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="confirm">
          <el-input type="password" v-model="formData.repassword"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="signUp">sign up</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";

@Component
export default class List extends Vue {
  formData = {
    name: "",
    password: "",
    repassword: ""
  };
  signUp() {
    this.$axios.post(`${host}/api/user/signup`, this.formData).then(res => {
      if (res.data.statusCode === 0) {
        
      } else if(res.data.statusCode === 1){
        this.$notify({
          title: "tips",
          message: res.data.msg
        });
      } else if(res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
      }
    });
  }
}
</script>

<style lang="stylus" scoped>
#sign-up {
  width: 100%;
  height: 100%;
  background: url("../assets/image/background.jpg") left top no-repeat
  background-size: 100% 100% 
}

.box-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 480px;
  min-height: 356px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .box-title {
    margin: 0 0 40px;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
  }
}
</style>