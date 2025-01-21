class apiResponse{
    constructor(status, data, message="Success"){
        this.statusCode=statusCode
        this.data = data;
        this.message = message;
        this.success= this.statusCode< 400
    }
}