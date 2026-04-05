import { useDispatch, useSelector } from "react-redux"
import { BlackjackApi } from "../api";
import type { ErrorResponse, LoginParams, RegisterParams, RootState } from "./types/StoreTypes";
import { onChecking, onClearStats, onLogin, onLogout } from "../store";

export const useAuthStore = () => {
    const api = BlackjackApi.getInstance();
    const { status, user, errorMessage } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const getApiErrorMessage = (error: ErrorResponse, fallback: string) => {
        const directError = error?.response?.data?.error;
        const directMessage = error?.response?.data?.message;

        if (directError) {
            return directError;
        }

        if (directMessage) {
            return directMessage;
        }

        const mappedErrors = error?.response?.data?.errors;
        if (mappedErrors && typeof mappedErrors === 'object') {
            const firstKey = Object.keys(mappedErrors)[0];
            const firstError = mappedErrors[firstKey];

            if (firstError && typeof firstError.msg === 'string') {
                return firstError.msg;
            }
        }

        return fallback;
    };

    const startLogin = async ({ username, password }: LoginParams) => {
        dispatch(onChecking());
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.user.name, _id: data.user.id }));
            return true;
        } catch (error) {
            const { response } = error as ErrorResponse;
            dispatch(onLogout(getApiErrorMessage({ response }, 'No se pudo iniciar sesion.')))
            return false;

        }
    }

    const startRegister = async ({ name, username, password }: RegisterParams) => {
        dispatch(onChecking());
        try {
            const { data } = await api.post('/auth/register', { name, username, password });
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.user.name, _id: data.user.id }));
            return true;
        } catch (error) {
            const { response } = error as ErrorResponse;
            dispatch(onLogout(getApiErrorMessage({ response }, 'No se pudo registrar el usuario.')))
            return false;
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(onClearStats());
            return dispatch(onLogout(undefined));
        }
        try {
            const { data } = await api.get('/auth/renew-token');
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.user.name, _id: data.user.id }));
        } catch (error) {
            const { response } = error as ErrorResponse;
            localStorage.clear();
            dispatch(onClearStats());
            dispatch(onLogout(getApiErrorMessage({ response }, 'Sesion expirada.')));
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onClearStats());
        dispatch(onLogout(undefined));
    }

    return {
        //* Properties
        status,
        user,
        errorMessage,

        //* Methods
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}
