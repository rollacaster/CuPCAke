import $ from 'jquery';

/**
 * Sends a POST request.
 * @param {string} url - The url of the request.
 * @param {object} data - The data for the request.
 * @memberOf module:Helpers
 */
export function post(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${contextGenerator}/v1/${url}`,
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      success: (response) => resolve(response),
      error: (xhr, status, err) => reject(xhr, status, err)
    });
  });
}

/**
 * Sends a PUT request.
 * @param {string} url - The url of the request.
 * @param {object} data - The data for the request.
 * @memberOf module:Helpers
 */
export function put(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${contextGenerator}/v1/${url}`,
      contentType: 'application/json',
      type: 'PUT',
      data: JSON.stringify(data),
      success: (response) => resolve(response),
      error: (xhr, status, err) => reject(xhr, status, err)
    });
  });
}

/**
 * Sends a DELETE request.
 * @param {string} url - The url of the request.
 * @param {object} data - The data for the request.
 * @memberOf module:Helpers
 */
export function remove(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${contextGenerator}/v1/${url}`,
      contentType: 'application/json',
      type: 'DELETE',
      data: JSON.stringify(data),
      success: (response) => resolve(response),
      error: (xhr, status, err) => reject(xhr, status, err)
    });
  });
}

/**
 * Sends a GET request.
 * @param {string} url - The url of the request.
 * @memberOf module:Helpers
 */
export function get(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${contextGenerator}/v1/${url}`,
      contentType: 'application/json',
      success: (response) => resolve(response),
      error: (xhr, status, err) => reject(xhr, status, err)
    });
  });
}
