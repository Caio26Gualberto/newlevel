import { Configuration, ResponseContext } from "../gen/api/src";

let originalRequest: ResponseContext | null

let basePathAPI = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_LOCAL

let basePathFront = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_FRONT_URL_PROD
    : process.env.REACT_APP_FRONT_URL_LOCAL

const ApiConfiguration = new Configuration({
    basePath: basePathAPI,

    accessToken: async (name, scopes) => {
        var accessToken = window.localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Token de acesso não encontrado no localStorage.");
            return '';
        }

        return accessToken;
    },

    middleware: [
        {

            post: async (context: ResponseContext) => {
                let ret = context.response;
                originalRequest = context;
                if (context.response.status == 401 || context.response.status == 403) {                  
                    const response = await fetch(`${basePathAPI}/api/Auth/RefreshToken`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            refreshToken: window.localStorage.getItem("refreshToken")
                        })
                    });
                    if (response.ok && response.status != 204) {
                        const newTokens = await response.json();
                        if (newTokens?.data?.token && newTokens?.data?.refreshToken) {
                            window.localStorage.setItem('accessToken', newTokens.data.token);
                            window.localStorage.setItem('refreshToken', newTokens.data.refreshToken);
                            const newRequest = new Request(originalRequest.url, {
                                method: originalRequest.init.method,
                                headers: new Headers(originalRequest.init.headers),
                                body: originalRequest.init.body,
                                redirect: originalRequest.init.redirect,
                                referrer: originalRequest.init.referrer,
                                referrerPolicy: originalRequest.init.referrerPolicy,
                                mode: originalRequest.init.mode,
                                credentials: originalRequest.init.credentials,
                                cache: originalRequest.init.cache,
                                integrity: originalRequest.init.integrity,
                                keepalive: originalRequest.init.keepalive,
                                signal: originalRequest.init.signal
                            });

                            newRequest.headers.set('Authorization', `Bearer ${newTokens.data.token}`);

                            ret = await fetch(newRequest);
                        } else {

                        }
                    } else {
                        window.location.href = basePathFront ?? 'http://localhost:3000';
                    }
                } else {
                    ret.json = async () => {
                        let result = await ret.clone().json();
                        return result;
                    };
                }

                return ret;
            }


        },
        {
            pre: async (context: ResponseContext) => {
                originalRequest = context;
                return context;
            }
        }
    ]
});

export default ApiConfiguration
