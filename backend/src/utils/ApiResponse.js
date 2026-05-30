class ApiResponse {
  constructor(data = null, message = "OK") {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
