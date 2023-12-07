// Helper functions for handling post HTTP requests

import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useDeleteRequest = () => {
    const axiosPrivate = useAxiosPrivate();
    const deleteRequest = async(id) => {
        try { 
            const response = await axiosPrivate.delete(`/post/${id}`);
            return { status: response.status }
        } catch (err) {
            if (!err.response) {
                return {
                    status: 500,
                    error: ['No server response'],
                }
            } else {
                return {
                    status: err.response.status,
                    error: err.response.data?.message || [err.response.data] 
                }
            }
        }
    }
    return deleteRequest;
}

export const useSaveRequest = () => {
    const axiosPrivate = useAxiosPrivate();
    const saveRequest = async(data, id) => {
        try {
            const response = (id)
                ? await axiosPrivate.put(`/post/${id}`, JSON.stringify(data))
                : await axiosPrivate.post('/post', JSON.stringify(data));
            return {
                status: response.status,
                data: response.data
            }
        } catch (err) {
            if (!err.response) {
                return {
                    status: 500,
                    error: ['No server response'],
                }
            } else {
                return {
                    status: err.response.status,
                    error: err.response.data?.message || [err.response.data] 
                }
            }
        }
    }
    return saveRequest;
}
