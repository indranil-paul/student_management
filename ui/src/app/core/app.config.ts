import { environment as env } from "src/environments/environment.prod"

const backendIP: string = env.backendIP

export const APIEndPoints = {
    api_health: backendIP + "api/health",
    api_user: backendIP + "api/user",
    api_signup: backendIP + "api/signup",
    api_gettoken: backendIP + "api/token",
    api_refreshtoken: backendIP + "api/token/refresh",
    api_verifytoken: backendIP + "api/token/verify",
    api_student: backendIP + "api/student",
}
