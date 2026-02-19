/* eslint-disable */
import $ from "jquery";
import { ApiError } from "../api-error/api-error";

/**
 * Отправка данных на сервер в виде JSON, а не url
 * @param {{}} params
 * @param {*} data
 * @return {*}
 */
const JSON_REQUEST_FORMAT = (params, data) => {
  params.contentType = "application/json; charset=utf-8";
  params.data = JSON.stringify(data);
  params.dataType = "json";
  return params;
};

/**
 *
 * @param {{}} params
 * @param {*} data
 * @return {*}
 */
const FORMDATA_REQUEST_FORMAT = (params, data) => {
  params.data = data;
  return params;
};

const requestFormat = FORMDATA_REQUEST_FORMAT;
const DEBUG = false;

function apiRequest(api_method, data, requestMethod) {
  return $.ajax(
    api_method,
    requestFormat({ method: DEBUG ? "GET" : requestMethod }, data)
  ).then(onStatus200, onStatusError);

  function onStatus200(response) {
    if (response.success === true) {
      return response.data;
    }
    throw ApiError.fromApiResponse(response);
  }
  function onStatusError(xhr) {
    throw xhr.responseJSON
      ? ApiError.fromApiResponse(xhr.responseJSON)
      : ApiError.fromHttpError(xhr);
  }
}

export class Api {
  getUrl(method) {
    return `${base_url("/api/v1")}${method}${DEBUG ? ".json" : ""}`;
  }

  parse(response) {
    if (response.success === true) {
      return response.data;
    }
    throw ApiError.fromApiResponse(response);
  }

  send(method, params) {
    return _params => {
      return apiRequest(
        this.getUrl(method),
        $.extend({}, _params, params && params.data),
        (params && params.requestMethod) || "POST"
      );
    };
  }
}
