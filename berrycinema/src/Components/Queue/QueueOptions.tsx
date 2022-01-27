import React, { FC, useState } from "react";
import { socket } from "../App";

import "./Queue.scss";

interface IQueueOptions {
    optiosOpen: boolean
}

const QueueOptions: FC<IQueueOptions> = (props) => {
    //// Handlers
    const videoServerStatusHandler = (status: boolean) => status ? socket.emit('server-video-start') 
                                                                 : socket.emit('server-video-stop');
    const videoSkipHandler = () => socket.emit('user-skip-video');

    return (
        <div className={props.optiosOpen ? "controlVideo controlVideoActive" : "controlVideo"}>
            {/* TO DEVELOP */}
            {/* <input type="range" /> */}
            <div className="buttons">
                <div
                    className="controlButton"
                    onClick={() => videoServerStatusHandler(true)}
                >
                    play
                </div>
                <div
                    className="controlButton"
                    onClick={() => videoServerStatusHandler(false)}
                >
                    stop
                </div>
                <div className="controlButton" onClick={() => videoSkipHandler()}>
                    skip
                </div>
            </div>
        </div>
    );
};

export default QueueOptions;
