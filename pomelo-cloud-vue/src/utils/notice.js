import {Message} from 'element-ui';
export function notice(params) {
  const {
    showClose = true, message = 'ok', type = 'success',
    duration = 2, center = false, iconClass = '',
  } = params;
  Message({
    showClose: showClose,
    message: message,
    type: type,
    duration: duration * 1000,
    center: center,
    iconClass: iconClass,
  });
}
