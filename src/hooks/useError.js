import {useContext} from 'react';
import ErrorContext from '../context/ErrorProvider';

const useError = () => {
    return useContext(ErrorContext);
}

export default useError;