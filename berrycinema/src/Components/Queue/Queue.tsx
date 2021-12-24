import React,{FC, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import getYouTubeID from 'get-youtube-id';
// import getYoutubeTitle from 'get-youtube-title';

import './queue.scss';
import {BiAddToQueue} from 'react-icons/bi'

import {IVideo, socket} from '../App';
import QueueElement from './QueueElement';

interface QueueProps {}
 
const Queue: FC<QueueProps> = (props) => {
    const [videos, setVideos] = useState<IVideo[]>([])
    const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);
    const [controlVideoOpen, setControlVideoOpen] = useState<boolean>(false);

    const [linkValue, setLinkValue] = useState<string>('');
    const [titleValue, setTitleValue] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');

    const smallPlayer = useRef<ReactPlayer>(null);
    const titleInput = useRef<HTMLInputElement>(null);
    const linkInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        socket.on('current-video-array', (videosQueue: IVideo[]) => {
            setVideos(videosQueue);
        });
    }, [videos]);

    const addVideoHandler = () => {
        const link = linkValue;
        if(ReactPlayer.canPlay(link))
        {
            const ytid = getYouTubeID(link);
            let thumbnail: string;
            if(ytid !== null)
                thumbnail = `https://img.youtube.com/vi/${ytid}/0.jpg`;
            else
                thumbnail = 'https://planasa.com/wp-content/uploads/2017/04/frambuesas-adelita.jpg';
                
            let title: string;
            // if(titleValue === '' && ytid !== null)
                // title = getYoutubeTitle(ytid).slice(0,50);
            // else
            title = titleValue.slice(0,50);

            let description: string = '';
            if(descriptionValue.length !== 0)
                description = descriptionValue.trim().slice(0,500);
            const newVideo: IVideo = {
                link,
                thumbnail,
                title,
                description,
                duration: smallPlayer.current!.getDuration(),
            };
            socket.emit('user-add-video', newVideo);
        }
    }

    const openVideoHandler = () => {
        setAddVideoOpen(!addVideoOpen);
        if(controlVideoOpen)
            setControlVideoOpen(false)
    };
    const openControlVideoHandler = () => {
        setControlVideoOpen(!controlVideoOpen)
        if(addVideoOpen)
            setAddVideoOpen(false)
    };
    
    const addVideoButtonHandler = () => {
        addVideoHandler();
        setLinkValue('');
        setTitleValue('');
        setDescriptionValue('');
        openVideoHandler();
    };

    const videoServerStatusHandler = (status: boolean) => {
        if(status)
             socket.emit('server-video-start'); 
         else
             socket.emit('server-video-stop');
    };
    console.log('xD reload queue')
    return ( 
        <div className='queueWrapper'>
            <div className={controlVideoOpen ? 'controlVideo controlVideoActive' : 'controlVideo'}>
                    <input type='range' />
                    <div className='buttons'>
                        <div className='controlButton' onClick={() => videoServerStatusHandler(true)}>
                            play
                        </div>
                        <div className='controlButton' onClick={() => videoServerStatusHandler(false)}>
                            stop
                        </div>
                        <div className='controlButton'>
                            skip
                        </div>
                    </div>
            </div>
            <div className={addVideoOpen ? 'addVideoForm addVideoFormActive' : 'addVideoForm'}>
                <div className='addControls'>
                    <div>
                        <p>Link:</p>
                        <input type="text" value={linkValue} onChange={e => {setLinkValue(e.target.value)}} required={true} ref={linkInput}/>                        
                    </div>
                    <div>
                        <p>Title:</p>
                        <input type="text" value={titleValue} onChange={e => {setTitleValue(e.target.value)}} required={true} maxLength={40} ref={titleInput}/>                        
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" value={descriptionValue} onChange={e => {setDescriptionValue(e.target.value)}} maxLength={300} ref={descriptionInput}/>
                    </div>
                </div>
                <button onClick={() => addVideoButtonHandler()}>Add</button>
                <ReactPlayer style={{display:'none'}} url={linkValue} height={`300px`} ref={smallPlayer} />
            </div>
            <div className='queueStats'>
                <h1>Playlista</h1>
                <div className='buttons'>
                    <div className='controlVideoButton' onClick={() => openControlVideoHandler()}>
                        Controls
                    </div>
                    <div className='addVideo' onClick={() => openVideoHandler()}>
                        Add Video <BiAddToQueue className='addIcon'/>
                    </div>
                </div>
            </div>
            <div className="line" />
            <div className='queueList'>
                {videos.map(el => (
                    <QueueElement 
                        title={el.title} 
                        link={el.link} 
                        duration={el.duration} 
                        thumbnail={el.thumbnail} 
                        description={el.description || ''}/>
                ))}
            </div>
        </div>
     );
}
 
export default Queue;