import Vue from 'vue';

export const Bus = new Vue();

export const operation = {
  open() {
    $('#global-uploader-btn').click();
  },
};

export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff'],
  getAll() {
    return [...this.image, ...this.video, ...this.document];
  },
};

