import {API} from '@/config';

export async function apiFetch(path, options = {}) {
    if (!API) throw new Error('falta NEXT_PUBLIC_API_URL');

    const token = getToken();

    const headers = { ...(options.headers) || {} };

    const isFormData = options.body instanceof FormData;
}