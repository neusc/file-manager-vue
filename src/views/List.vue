<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <div class="username">{{username}}</div>
      <v-speed-dial
        v-model="fab"
        direction="bottom"
        :open-on-hover="hover"
        :transition="transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-file</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="indigo" @click="openUpload">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="openEditTool">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-data-table
          loading
          loading-text="Loading... Please wait"
          :headers="headers"
          :items="fileList"
          :items-per-page="10"
          class="elevation-1"
          :show-select="showSelect"
          :single-select="singleSelect"
          item-key="name"
          v-model="selectedFiles"
          @input="onSelected"
        ></v-data-table>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
    <Upload ref="upload" @upload-finish="onUploadFinished" />
    <EditTool ref="tool" :count="selectedFiles.length" @delete="onDelete" @cancel="onSelectCancel" />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Upload from "@/components/upload.vue";
import EditTool from "@/components/editTool.vue";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";

interface CustomFile {
  name: string;
  path: string;
  size: number;
  modTime: number;
}

interface FormatFile {
  name: string;
  path: string;
  size: string;
  modTime: string;
}

@Component({
  components: {
    Upload,
    EditTool
  }
})
export default class List extends Vue {
  @Prop() source!: string;
  username = Object.values(this.GLOBAL.getUser())[0].name;
  headers = [
    {
      text: "Name",
      align: "left",
      sortable: false,
      value: "name"
    },
    { text: "Size", value: "size" },
    { text: "Modified Time", value: "modTime" }
  ];
  fileList: FormatFile[] = [];
  selectedFiles: FormatFile[] = [];
  showSelect = false;
  showUpload = false;
  drawer = null;
  singleSelect = false;

  direction = "top";
  hover = true;
  transition = "slide-y-reverse-transition";
  fab = false;

  mounted() {
    this.getFileList();
  }

  onSelected(items: FormatFile[]) {
    this.selectedFiles = items;
  }

  onSelectCancel() {
    this.showSelect = false;
    this.selectedFiles = [];
  }

  openUpload() {
    //@ts-ignore
    this.$refs.upload.open();
  }

  openEditTool() {
    this.showSelect = true;
    //@ts-ignore
    this.$refs.tool.open();
  }

  onUploadFinished() {
    this.getFileList();
  }

  getFileList() {
    this.$axios.post(`${host}/api/file/list`).then(res => {
      if (res.data.statusCode === 0) {
        this.fileList = this.handleData(res.data.data);
      } else if (res.data.statusCode === 1) {
        this.$notify({
          title: "tips",
          message: res.data.msg
        });
      } else if (res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
      }
    });
  }

  handleData(data: CustomFile[]): FormatFile[] {
    return data.map((d: CustomFile) => {
      return {
        ...d,
        size: this.formatSize(d.size),
        modTime: this.formatTime(d.modTime)
      };
    });
  }

  onDelete() {
    let names = this.selectedFiles.map(file => file.name);
    this.$axios.post(`${host}/api/file/delete`, { names }).then(res => {
      if (res.data.statusCode === 0) {
        this.$toasted.success(
          `${names.length +
            " " +
            (names.length > 1 ? "files" : "file")} delete success!`
        );
        this.getFileList();
        this.onSelectCancel();
        // @ts-ignore
        this.$refs.tool.close();
      }
    });
  }

  logOut() {
    this.$axios.post(`${host}/api/user/logout`).then(res => {
      if (res.data.statusCode === 0) {
      } else if (res.data.statusCode === 1) {
        this.$toasted.error(res.data.msg);
      } else if (res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
        this.GLOBAL.clear();
      }
    });
  }

  formatTime(time: number): string {
    return timestampToDate(time);
  }
  formatSize(size: number): string {
    const kSize = size / 1000;
    let mSize = "";
    if (kSize > 1000) {
      mSize = (kSize / 1000).toFixed(1);
      return `${mSize}M`;
    } else {
      return `${kSize.toFixed(1)}K`;
    }
  }
}
</script>

<style lang="stylus" scoped>
.container {
  padding: 0;
}

.v-data-table {
  width: 100%;
  height: 100%;
}

.v-speed-dial {
  margin-left: 20px;
}
</style>
