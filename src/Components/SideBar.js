import React from 'react'
import MyDropzone from './MyDropzone';

const SideBar = () => {
    return (
        <div className="d-flex flex-column bg-dark text-white p-3 vh-100" style={{width: '300px'}}>
            <MyDropzone />    
        </div>
    )
}

export default SideBar
