export const ajaxResult = (result, status = 200, message = null) => {
  return {
    result,
    status,
    message,
  };
};

export const ajaxErrorResult = (
  result = null,
  message = '系统错误，请联系管理员',
  status = 500
) => {
  return ajaxResult(result, status, message);
};

export const ajaxSuccessResult = (
  result = null,
  message = '操作成功',
  status = 200
) => {
  return ajaxResult(result, status, message);
};
