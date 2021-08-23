import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from "jquery";

const PreviewContainer = () => {

    const fileName = useSelector(state => state.fileName);
    const svgString = useSelector(state => state.svgString);
    return (
        <div className="flex-grow-1 d-flex bg-dark pt-4 pb-3">
            <div id="canvas" className="mx-4 bg-white w-100 h-100 position-relative rounded-3">
            </div>
        </div>
    )
}

export default PreviewContainer