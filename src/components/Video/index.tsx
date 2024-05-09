import React, { useRef, useEffect } from 'react';

import './style.css';

export type styleProps = {
    video?: object;
    canvas?: object;
}

function Video({
    width,
    height,
    source,
    style
}: {
    width: number,
    height: number,
    source: string
    style?: styleProps,
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let step: number | null;

    const draw = () => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const video: HTMLVideoElement | null = videoRef.current;

        if (!canvas || !video) return;

        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

        if (!context) return;

        context.filter = "blur(10px)"
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const drawLoop = () => {
        draw();
        step = window.requestAnimationFrame(drawLoop)
    }

    const drawPause = () => {
        if (!step) return;

        window.cancelAnimationFrame(step);
        step = null;
    }

    useEffect(() => {
        const video: HTMLVideoElement | null = videoRef.current;
        if (!video) return;

        video.addEventListener('loadeddata', draw, false);
        video.addEventListener('seeked', draw, false);
        video.addEventListener('play', drawLoop, false);
        video.addEventListener('pause', drawPause, false);
        video.addEventListener('ended', drawPause, false);

        return () => {
            video.removeEventListener('loadeddata', draw);
            video.removeEventListener('seeked', draw);
            video.removeEventListener('play', drawLoop);
            video.removeEventListener('pause', drawPause);
            video.removeEventListener('ended', drawPause);
        }
    }, []);

    return (
        <React.Fragment>
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                className="canvas"
                style={style?.canvas}>

            </canvas>

            <video
                width={width}
                height={height}
                ref={videoRef}
                controls
                id="video"
                className="video"
                style={style?.video}>
                <source src={source}></source>
            </video>
        </React.Fragment>
    )
}

export default Video
