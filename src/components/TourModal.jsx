import useModal from '../hooks/useModal';

const TourModal = () => {
    const { setModal } = useModal();
    return (
        <div className='modal-note'>
            <h1>Not Authorized</h1>
            <p>Thank you for touring the admin features.</p> 
            <p>Unfortunately, the administrative tour is not authorized to commit any changes. Hopefully the experience has given you insight as to how this page works.</p>
            <p>For more information please consider viewing the <a href="https://github.com/jimmyquadros/blog-frontend">repository</a>.</p>
            <button type='button' onClick={() => setModal()}>Close</button>
        </div>
    )
}

export default TourModal;
