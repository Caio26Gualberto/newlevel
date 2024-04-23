import { Configuration, ResponseContext } from "./gen/api/src";

let originalRequest: ResponseContext | null

const ApiConfiguration = new Configuration({
    basePath: "https://localhost:7258",

    accessToken: async (name, scopes) => {
        const accessToken = window.localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Token de acesso não encontrado no localStorage.");
            return '';
        }

        return accessToken;
    },

    middleware: [
        {

            post: async (context: ResponseContext) => {
                debugger
                let ret = context.response;
                originalRequest = context;
                let contentType = context.response.headers.get('content-type');
                if (context.response.status == 401 || context.response.status == 403) {
                    const response = await fetch(`https://localhost:7258/api/Authenticate/RenewToken?accessToken=${window.localStorage.getItem('accessToken')}`)
                    if (response.ok) {
                        console.log(await response.text());
                        const newTokens = await response.json();
                        if (newTokens.token && newTokens.refreshToken) {
                            window.localStorage.setItem('accessToken', newTokens.accessToken);
                            window.localStorage.setItem('refreshToken', newTokens.refreshToken);
                        } else {
                            console.error("Tokens de acesso ou atualização não encontrados na resposta.");
                        }
                    }
                    if (originalRequest) {
                        ret = await fetch(originalRequest.url, originalRequest.init);
                    }
                } else {
                    ret.json = async () => {
                        debugger
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