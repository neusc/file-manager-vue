<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Upload Files</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-file-input
                chips
                multiple
                show-size
                counter
                loading
                label="Select Files"
                @change="onFileSelected"
                @click:clear="onFileClear"
                v-if="uploadReady"
              ></v-file-input>
            </v-row>
            <v-progress-linear :value="percent" v-if="percent > 0"></v-progress-linear>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          <v-btn color="blue darken-1" text @click="upload">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { host } from "@/config";
import { AxiosResponse } from "axios";

@Component
export default class Upload extends Vue {
  fileList: File[] = [];
  showDialog = false;
  uploadReady = true;
  percent = 0;
  source = null;
  uploadFinished = false;

  open() {
    this.showDialog = true;
  }

  close() {
    this.clear();
    if (!this.uploadFinished) {
      this.cancel();
    }
    this.showDialog = false;
    this.percent = 0;
    this.uploadFinished = false;
  }

  clear() {
    this.uploadReady = false;
    this.$nextTick(() => {
      this.uploadReady = true;
    });
  }

  onFileSelected(files: File[]) {
    this.fileList = files;
  }

  onFileClear() {
    this.percent = 0;
    if (!this.uploadFinished) {
      this.cancel();
    }
  }

  cancel() {
    if (this.source) {
      // @ts-ignore
      this.source && this.source.cancel("Operation canceled by the user.");
    }
  }

  upload() {
    if (!this.fileList.length) {
      return;
    }
    const formData = new FormData();
    Array.prototype.forEach.call(this.fileList, (file: File) => {
      formData.append("files", file);
    });
    // @ts-ignore
    const CancelToken = this.$axios.CancelToken;
    const source = (this.source = CancelToken.source());
    this.$axios
      .post(`${host}/api/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          this.percent = (progressEvent.loaded / progressEvent.total) * 100;
        },
        cancelToken: source.token
      })
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 0) {
          this.uploadFinished = true;
          this.$toasted.success(res.data.msg);
          this.close();
          this.$emit("upload-finish");
        } else if (res.data.statusCode === 1) {
          this.$toasted.error(res.data.msg);
        } else if (res.data.statusCode === 2) {
          this.$router.push({ name: res.data.data });
        }
      })
      .catch((e: Error) => {
        this.$toasted.error(e.message);
      });
  }
}
</script>


<style lang="stylus" scoped>
.md-dialog {
  padding: 20px;
}

.v-progress-linear {
  margin-top: 30px;
}
</style>