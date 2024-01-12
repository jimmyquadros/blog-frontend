// Context for components with wrapped error reporting
import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ErrorContext = createContext(null);

export const ErrorProvider = ({children, top}) => {

    const [err, setErr] = useState([]);

    // useEffect(() => {
    //     // console.log(err)
    //     if (!Array.isArray(err)) setErr([err]);
    // }, [err, setErr])

    const removeErr = (i) => {
        if (!Array.isArray()) setErr([]);
        setErr(
            [
                ...err.slice(0, i),
                ...err.slice(i + 1)
            ]
        )
    }

    return (
        <ErrorContext.Provider value = {{setErr}}>
            <div className='error-provider'>
                {!top && children}
                <ul>
                    {Array.isArray(err) ? err.map((e, i) => (
                        <li key={uuidv4()}>
                            {e}
                            <FontAwesomeIcon icon={faXmark} onClick={() => removeErr(i)} />
                        </li>
                    )) : (<li key={uuidv4()}>Error...</li>)}
                </ul>
                {top && children}
            </div>
        </ErrorContext.Provider>
    )
}

export default ErrorContext;
