import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from "jquery";

const PreviewContainer = () => {

    const fileName = useSelector(state => state.fileName);
    const svgString = useSelector(state => state.svgString);
    return (
        <div className="flex-grow-1 d-flex bg-dark">
            <div id="canvas" className="mx-auto my-2 bg-white w-90 position-relative" style={{height: '60vh'}}>
            </div>
        </div>
    )
}

export default PreviewContainer