<template>
  <div>
    <div id="upload">
      <el-form ref="form" :model="formData" label-width="160px">
        <el-form-item label="Your email address">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="Custom file label">
          <el-input v-model="formData.fileLabel"></el-input>
        </el-form-item>
        <el-form-item label="File to stash">
          <el-upload
            class="upload-select-btn"
            :action="uploadUrl"
            name="uploadfile"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button type="primary" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="return file list">
          <router-link :to="{name:'list'}">
            <el-button type="primary" class="return-back_btn" icon="el-icon-s-home">返回</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { host } from "@/config";

@Component
export default class Upload extends Vue {
  formData = {
    email: "",
    fileLabel: "",
    uploadFile: ""
  };
  fileList = [];

  get uploadUrl(): string {
    return `${host}/api/file/upload`;
  }

  handleExceed() {
    this.$notify({
      title: "tips",
      message: "一次上传文件数不能超过三个哦~"
    });
  }
}
</script>

<style lang="stylus" scoped>
#upload {
  margin-top: 36px;
}
</style>

