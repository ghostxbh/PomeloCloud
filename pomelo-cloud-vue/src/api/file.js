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
