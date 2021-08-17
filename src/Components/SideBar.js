import React from 'react'
import MyDropzone from './MyDropzone';
import LayerContainer from './LayerContainer';
import ExportBar from './ExportBar';

const SideBar = () => {
    return (
        <div className="d-flex flex-column flex-shrink-0 bg-dark text-white p-3 vh-100" style={{width: '330px'}}>
            <MyDropzone />
            <div className="w-100 bg-white my-2" style={{height: '1px'}}></div>
            <LayerContainer />
            <div class="w-100 bg-white my-2" style={{height: '1px'}}></div>
            <ExportBar />    
        </div>
    )
}

export default SideBar
