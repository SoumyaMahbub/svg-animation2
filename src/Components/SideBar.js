import React from 'react'
import MyDropzone from './MyDropzone';
import LayerContainer from './LayerContainer';
import ExportBar from './ExportBar';

const SideBar = () => {
    return (
        <div className="d-flex flex-column flex-shrink-0 bg-secondary text-white p-3 vh-100 shadow-lg" style={{width: '330px'}}>
            <MyDropzone />
            <LayerContainer />
            <ExportBar />    
        </div>
    )
}

export default SideBar
