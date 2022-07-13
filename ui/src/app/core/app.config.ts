const backendIP: string = "http://127.0.0.1:8000/" 

export const APIEndPoints = {
    api_health: backendIP + "api/health/",
    api_user: backendIP + "api/user/",
    api_gettoken: backendIP + "api/token/",
    api_refreshtoken: backendIP + "api/token/refresh/",
    api_verifytoken: backendIP + "api/token/verify/",
    api_studprofile: backendIP + "api/student/",
}
