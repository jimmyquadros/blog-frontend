// Context for components with wrapped error reporting

import { createContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ErrorContext = createContext(null);

export const ErrorProvider = ({children, top}) => {

    const [err, setErr] = useState([]);

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
                    {err.map((e, i) => (
                        <li key={uuidv4()}>
                            {e}
                            <FontAwesomeIcon icon={faXmark} onClick={() => removeErr(i)} />
                        </li>
                    ))}
                </ul>
                {top && children}
            </div>
        </ErrorContext.Provider>
    )
}

export default ErrorContext;
