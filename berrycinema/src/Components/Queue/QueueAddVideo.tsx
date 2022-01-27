import React, { FC, useRef, useState } from "react";
import ReactPlayer from 'react-player';
import getYouTubeID from 'get-youtube-id';
import { IVideo, socket } from "../App";

import { IoCloseOutline } from 'react-icons/io5';

import "./QueueAddVideo.scss";

interface IQueueAddVideo {
    addVideoOpen(): void;
    isOpen: boolean;
}

const QueueAddVideo: FC<IQueueAddVideo> = (props) => {
    //States
    const [linkValue, setLinkValue] = useState<string>('');
    const [titleValue, setTitleValue] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');
    //Refs
    const background = useRef<HTMLDivElement>(null);
    const closeButton = useRef<HTMLButtonElement>(null);
    const titleInput = useRef<HTMLInputElement>(null);
    const linkInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);
    const smallPlayer = useRef<ReactPlayer>(null);
    //Handlers
    const addVideoButtonHandler = () => {
        addVideoHandler();
        setLinkValue('');
        setTitleValue('');
        setDescriptionValue('');
    };
    const addVideoHandler = () => {
        const link = linkValue;
        if (ReactPlayer.canPlay(link)) {
            const ytid = getYouTubeID(link);
            let thumbnail: string;
            if (ytid !== null)
                thumbnail = `https://img.youtube.com/vi/${ytid}/0.jpg`;
            else
                thumbnail = 'https://planasa.com/wp-content/uploads/2017/04/frambuesas-adelita.jpg';

            let title: string;
            // if(titleValue === '' && ytid !== null)
            // title = getYoutubeTitle(ytid).slice(0,50);
            // else
            title = titleValue.slice(0, 50);

            let description: string = '';
            if (descriptionValue.length !== 0)
                description = descriptionValue.trim().slice(0, 500);
            const newVideo: IVideo = {
                link,
                thumbnail,
                title,
                description,
                duration: smallPlayer.current!.getDuration(),
            };
            socket.emit('user-add-video', newVideo);
            props.addVideoOpen();
        }
    }
    const closeWindowHandler = (e:any ) => {
        if(e.target === background.current || e.target.parentElement === closeButton.current)
            {
                console.log(e.target)
                props.addVideoOpen();
            }
    }

    return (
        <div className={props.isOpen ? 'background backgroundOpen' : 'background backgroundHidden'} onMouseDown={closeWindowHandler} ref={background}>
            <div className="wrapper">
                <button className="close" ref={closeButton}>
                    <IoCloseOutline className="closeIcon"/>
                </button>
                <p className="addVideoTitle">
                    Add video:
                </p>
                <div className="addControls">
                    <div>
                        <p>Link</p>
                        <input type="text" value={linkValue} onChange={e => { setLinkValue(e.target.value) }} required={true} ref={linkInput} />
                    </div>
                    <div>
                        <p>Title</p>
                        <input type="text" value={titleValue} onChange={e => { setTitleValue(e.target.value) }} required={true} maxLength={40} ref={titleInput} />
                    </div>
                    <div>
                        <p>Description</p>
                        <input type="text" value={descriptionValue} onChange={e => { setDescriptionValue(e.target.value) }} maxLength={300} ref={descriptionInput} />
                    </div>
                </div>
                <button className="addVideoButton" onClick={() => addVideoButtonHandler()}>Add</button>
                <ReactPlayer style={{ display: 'none' }} url={linkValue} ref={smallPlayer} />
            </div>
        </div>
    );
};

export default QueueAddVideo;
