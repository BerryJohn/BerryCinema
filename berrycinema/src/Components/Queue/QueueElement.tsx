import React,{ FC } from 'react';

import './Queue.scss';


interface IQueueElementProps {
    id: number;
    title: string;
    duration: number;
    link: string;
    thumbnail: string;
    description: string;
}
 
const QueueElement: FC<IQueueElementProps> = (props) => {

    return ( 
        <div className={props.id === 0 ? 'elementWrapper elementWrapperFirst' : 'elementWrapper'}>
            <a href={props.link} target={'_blank'}>
                <div className="image">
                    <img src={props.thumbnail} alt='Video thumbnail'/>
                </div>
            </a>
            <div className="elementInfo">
                <a href={props.link} target={'_blank'}>
                    <div className="title">{props.title}</div>
                </a>
                <div className="description">{props.description}</div>
                <div className="duration">{new Date(props.duration * 1000).toISOString().substr(11, 8)}</div>
            </div>

        </div>
     );
}
 
export default QueueElement;