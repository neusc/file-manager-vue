<template>
  <div id="list">
    <div class="header"></div>
    <el-table :data="tableData" highlight-current-row :height="tableHeight()" style="width: 100%">
      <el-table-column prop="name" class-name="name" label="名称" width="480"></el-table-column>
      <el-table-column prop="size" label="大小" width="180" sortable :formatter="formatSize"></el-table-column>
      <el-table-column prop="modTime" label="最后修改时间" sortable :formatter="formatTime"></el-table-column>
      <el-table-column label="操作" class-name="operate_area">
        <template slot-scope="scope">
          <a class="download_link" :href="scope.row.path">
            <el-button type="primary" icon="el-icon-download">下载</el-button>
          </a>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.name)">删除</el-button>
          <router-link :to="{name:'upload'}">
            <el-button type="primary" class="upload_btn" icon="el-icon-upload">上传</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";

@Component
export default class List extends Vue {
  tableData = [];

  mounted() {
    this.getFileList();
  }

  tableHeight(): number {
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    return clientHeight - 40;
  }

  getFileList() {
    this.$axios.post(`${host}/api/file/list`).then(res => {
      if (res.data.statusCode === 0) {
        this.tableData = res.data.data;
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

  handleDelete(name: string) {
    this.$axios.post(`${host}/api/file/delete`, { name }).then(res => {
      if (res.data.statusCode === 0) {
        this.$notify({
          title: "tips",
          message: "删除成功~"
        });
        this.getFileList();
      }
    });
  }

  formatTime(row: any, column: any, cellValue: number, index: number): string {
    return timestampToDate(cellValue);
  }

  formatSize(row: any, column: any, cellValue: number, index: number): string {
    const kSize = cellValue / 1000;
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
.name {
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.download_link {
  width: 100%;
  height: 100%;
  margin-right: 10px;
}

.upload_btn {
  margin-left: 10px;
}

::-webkit-scrollbar {
  display: none;
}
</style>
