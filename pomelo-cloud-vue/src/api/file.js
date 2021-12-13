import request from '@/utils/request';

export function list(data) {
  return request({
    url: '/file/list',
    method: 'post',
    data: data,
  });
}

export function sidebar() {
  return request({
    url: '/file/sidebar',
    method: 'get',
  });
}

export function create(type, data) {
  return request({
    url: '/file/create?type=' + type,
    method: 'post',
    data: data,
  });
}

export function remove(data) {
  return request({
    url: '/file/remove',
    method: 'delete',
    data: data,
  });
}

export function rename(data) {
  return request({
    url: '/file/rename',
    method: 'post',
    data: data,
  });
}

export function copy(data) {
  return request({
    url: '/file/copy',
    method: 'post',
    data: data,
  });
}

export function cut(data) {
  return request({
    url: '/file/cut',
    method: 'post',
    data: data,
  });
}


export function paste(data) {
  return request({
    url: '/file/paste',
    method: 'post',
    data: data,
  });
}
