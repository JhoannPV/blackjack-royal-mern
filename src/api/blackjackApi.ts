import axios, { type AxiosInstance } from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables();

export class BlackjackApi {
    private static blackjackApi: AxiosInstance;

    private constructor() { }

    public static getInstance(): AxiosInstance {
        if (!BlackjackApi.blackjackApi) {
            BlackjackApi.blackjackApi = axios.create({
                baseURL: VITE_API_URL,
            });

            // TODO: Configurar interceptores
            BlackjackApi.blackjackApi.interceptors.request.use(config => {
                config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`;
                return config;
            })
        }
        return BlackjackApi.blackjackApi;
    }
}