import React from 'react'
import PreviewContainer from './PreviewContainer'
import OperationsContainer from './OperationsContainer'

const RightPanel = () => {
    return (
        <div className="w-100 d-flex flex-column">
            <PreviewContainer />
            <OperationsContainer />
        </div>
    )
}

export default RightPanel
