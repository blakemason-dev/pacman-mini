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
            setHeight(width * 1080 / 1960);

            window.addEventListener('resize', (e) => {
                setWidth(window.innerWidth);
                setHeight(window.innerWidth * 1080 / 1960);
            });
        }
        initialised.current = true;
    }, []);

    return (
        <div 
            className="game-viewer"
            style={{width: `${width*.9}px`, height: `${height*.9}px`}}
        >
            {props.accessKey &&
                <iframe
                    className="game-viewer__iframe"
                    src={`http://localhost:8765/play/` + props.accessKey}
                    allowFullScreen={true}
                />
            }
        </div>
    )
}

export default GameViewer;