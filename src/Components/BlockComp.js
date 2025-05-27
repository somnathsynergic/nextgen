import { BlockUI } from 'primereact/blockui'
import React from 'react'

function BlockComp({ children, classname, template, blocked }) {
    return (
        <BlockUI blocked={blocked} template={template} className={classname}>
            {children}
        </BlockUI>
    )
}

export default BlockComp