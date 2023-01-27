import React, { useEffect, useRef, useState } from "react";

import './GameViewer.css';

interface iProps {
    accessKey: string | null;
}

const GameViewer = (props: iProps = { accessKey: null }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const initialised = useRef(false);

    useEffect(() => {
        if (!initialised.current) {

        }
        initialised.current = true;
    }, [])

    return (
        <div 
            className="game-viewer"
            style={{width: `${width}px`, height: `${height}px`}}
        >
            {props.accessKey &&
                <iframe
                    className="game-viewer__iframe"
                    src={`http://localhost:8765/play/` + props.accessKey}
                    allowFullScreen={true}
                    width={width}
                    height={height}
                />
            }
        </div>
    )
}

export default GameViewer;