import React, {FC, useState} from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    currentVideo: string;
}
 
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
    const [currentVideo, setVideo] = useState('');

    const onPlayHandler = () => {

    };

    return (
        <>
            <ReactPlayer 
                url={props.currentVideo}

            />
        </>
    );
}
 
export default VideoPlayer;