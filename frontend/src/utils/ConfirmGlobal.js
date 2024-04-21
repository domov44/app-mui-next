// ConfirmGlobal.js
import React, { useState, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog';

const confirmAction = {
    current: () => Promise.resolve(true)
}

export function confirm(config) {
    return confirmAction.current(config);
}

function ConfirmGlobal() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [config, setConfig] = useState({});
    const resolveRef = useRef(() => { })
    confirmAction.current = (newConfig) =>
        new Promise((resolve) => {
            setConfig(newConfig);
            setDialogOpen(true);
            resolveRef.current = resolve;
        });

    return (
        <div>
            <ConfirmDialog
                onConfirm={() => {
                    resolveRef.current(true);
                    setDialogOpen(false);
                }}
                onCancel={() => {
                    resolveRef.current(false);
                    setDialogOpen(false);
                }}
                open={dialogOpen}
                {...config} // Transmettre les propriétés du dialogue personnalisées
            />
        </div>
    );
}

export default ConfirmGlobal;