import request from '@/utils/request';

// login
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data,
  });
}

// logout
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

// getcode
export function getCodeImg() {
  return request({
    url: '/captcha',
    method: 'get',
    timeout: 20000,
  });
}
