import { useState, useEffect } from 'react';

const getLocalValue = (key, initValue) => {
    // Next.js
    if (typeof window === 'undefined') return initValue;

    // if already stored
    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue) return localValue;

    // return restult of a function
    if (initValue instanceof Function) return initValue();

    return initValue
}

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return  [value, setValue];
}

export default useLocalStorage;
