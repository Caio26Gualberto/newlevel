import { Configuration, ErrorContext, ResponseContext } from "./gen/api/src";

let originalRequest: ResponseContext | null

const ApiConfiguration = new Configuration({
    basePath: "https://localhost:7082",

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
                let contentType = context.response.headers.get('content-type');
                if (context.response.status == 401 || context.response.status == 403) {
                    const response = await fetch(`https://localhost:7082/api/Authenticate/RenewToken?accessToken=${window.localStorage.getItem('accessToken')}`);
                    if (response.ok && response.status != 204) {
                        const newTokens = await response.json();
                        if (newTokens.token && newTokens.refreshToken) {
                            window.localStorage.setItem('accessToken', newTokens.token);
                            window.localStorage.setItem('refreshToken', newTokens.refreshToken);
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
            
                            newRequest.headers.set('Authorization', `Bearer ${newTokens.token}`);
            
                            ret = await fetch(newRequest);
                        } else {
                            
                        }
                    } else {
                        window.location.href = 'http://localhost:3000';
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