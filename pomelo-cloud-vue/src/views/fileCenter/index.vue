<template>
  <el-container class="file-container">
    <header class="file-header">
      <el-button size="medium" @click="backPath">
        <i class="el-icon-back"></i>
      </el-button>
      <div class="file-path">
        <ul>
          <li v-for="item in fileDirpath">
            <a @click="getFileList(item.url)">
              {{ item.name }}
              <span> > </span>
            </a>
          </li>
        </ul>
      </div>
      <el-button size="medium" @click="refreshPath">
        <i class="el-icon-refresh"></i>
      </el-button>
      <el-input class="header-search" ize="50" v-model="condition.options.keywords">
        <el-button slot="append" icon="el-icon-search" @click="getFileList()"></el-button>
      </el-input>
    </header>

    <el-container>
      <el-aside class="context-aside" width="200px">
        <tr v-for="item in sidebar">
          <hr v-if="item.hasHr">
          <td>
            <a @click="getFileList(item.link)">
              <i :class="item.icon"></i>
              {{ item.title }}
            </a>
          </td>
        </tr>
      </el-aside>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        element-loading-text="Loading"
        max-height="500"
        v-loading="listLoading"
        :data="list"
        :default-sort="{order: 'name, updateTime, size'}"
        fit
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="name" align="left" label="文件名" width="320">
          <template slot-scope="scope">
            <a v-if="scope.row.isFolder"
               @click="getFileList(condition.path + '/' +scope.row.name)">
              <svg-icon icon-class="folder" class-name="folder-icon"/>
              {{ scope.row.name }}
            </a>
            <a v-if="scope.row.isFile"
               @click="">
              <svg-icon icon-class="fileIcon" class-name="file-icon"/>
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column sortable prop="updateTime" label="最后修改日期" width="160" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.lastUpdateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="size" label="大小" width="80" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.isFile">
              {{ scope.row.size }}
            </span>
            <span v-if="scope.row.isFolder">
              {{ scope.row.size }} 项
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table>
    </el-container>
    <el-footer>
      <div class="func-button-group">
        <el-row>
          <el-button size="medium" @click="fileUpload">上传</el-button>
          <el-button size="medium">下载</el-button>
          <el-button size="medium">新建</el-button>
          <el-button size="medium" @click="goRootPath" icon="el-icon-receiving">
            根目录( / )
          </el-button>
          <el-button size="medium" icon="el-icon-connection">
            终端
          </el-button>
        </el-row>
      </div>
      <div class="block" id="pomelo-page-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100, 200, 500, 1000]"
          :current-page.sync="condition.page.pageNo"
          :page-size.sync="condition.page.pageSize"
          :total="condition.page.total"
          layout="slot, prev, pager, next, sizes, jumper"
          pager-count="5"
          background
        >
          <span>目录: {{ folderCount }} 个</span>
          <span>文件: {{ fileCount }} 个</span>
        </el-pagination>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import {list, sidebar} from '@/api/file';
import {parseFileSize} from '@/utils';
import {Message} from 'element-ui';
import Uploader from '@/components/Uploader';

const {Bus, operation} = require('@/utils/uploader');

export default {
  name: 'FileManager',
  components: {Uploader},
  data() {
    return {
      list: [],
      listLoading: true,
      condition: {
        path: 'D:/IDE_Spances/Webstorm_Spance',
        page: {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        },
        options: {
          keywords: '',
          sort: '',
        },
      },
      fileCount: 0,
      folderCount: 0,
      sidebar: [],
      multipleSelection: [],
      fileDirpath: [],
    };
  },
  created() {
    this.getFileSidebar();
    this.getFileList();
  },
  methods: {
    handleSizeChange(val) {
      this.condition.page.pageSize = val;
      this.getFileList();
    },
    handleCurrentChange(val) {
      this.condition.page.pageNo = val;
      this.getFileList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    assemblyPath(dirLink = [], index) {
      let path = '';
      for (let i = 0; i < index; i++) {
        const p = dirLink[i];
        path += p + '/';
      }
      return path;
    },
    getFileSidebar() {
      sidebar().then(response => {
        const {data} = response;
        this.sidebar = data;
      });
    },
    backPath() {
      const path = this.fileDirpath.length < 2 ?
        this.fileDirpath[this.fileDirpath.length - 1].url :
        this.fileDirpath[this.fileDirpath.length - 2].url;
      this.getFileList(path);
    },
    refreshPath() {
      this.getFileList();
      Message({
        message: '刷新成功',
        type: 'success',
        duration: 5 * 1000,
      });
    },
    goRootPath() {
      this.getFileList('/');
    },
    getFileList(path) {
      this.listLoading = true;
      if (path) {
        this.condition.path = path;
        this.condition.page = {
          pageNo: 1,
          pageSize: this.condition.page.pageSize,
        };
      }
      list({...this.condition}).then(response => {
        const {data} = response;
        this.condition.page = data.condition.page;

        this.condition.path = data.path;
        const paths = data.path.split('/');
        this.fileDirpath = [];
        for (let i = 0; i < paths.length; i++) {
          const name = paths[i];
          if (name) {
            const url = this.assemblyPath(paths, i + 1);
            this.fileDirpath.push({url, name});
          }
        }
        this.fileCount = data.fileCount;
        this.folderCount = data.folderCount;
        data.fileList.map(file => file.size = file.isFile ? parseFileSize(file.size) : file.size);
        this.list = data.fileList;
        this.listLoading = false;
      });
    },
    fileUpload() {
      operation.open();
    },
  },
};
</script>

<style lang="scss">
.file-container {
  margin: 0.5% 0.5%;

  a:hover {
    color: #00A0C6;
    //font-size: 20px;
    text-decoration: none;
  }

  .file-header {
    float: left;
    height: 40px;
    width: 100%;
    //border: 1px #cacdce solid;
    font-size: 13px;
    margin-bottom: 0.5%;

    .el-button {
      margin: 0.1% auto;
      float: left;
    }

    .file-path {
      float: left;
      height: 38px;
      width: 58%;
      background-color: #f8f7f7;

      li {
        padding-left: 0.5%;
        list-style: none;
        float: left;
      }

      span {
        margin: 0 auto;
      }
    }

    .header-search {
      height: 38px;
      float: right;
      width: 30%;
    }
  }

  .el-container {
    margin-bottom: 0.5%;
  }

  .context-aside {
    background-color: #f1f3f3;
    padding-left: 2%;
    height: 500px;

    td {
      float: left;
      padding-top: 20%;
    }

    hr {
      margin-top: 20%;
    }
  }

  .folder-icon {
    width: 20px;
    height: 20px;
  }

  .file-icon {
    width: 20px;
    height: 20px;
  }

  .el-footer {
    span {
      margin-right: 10px;
      font-weight: 400;
      color: #606266;
    }

    .func-button-group {
      line-height: 40px;
      text-align: left;
      bottom: 7%;
      position: absolute;
      z-index: 99;
    }
  }
}
</style>
