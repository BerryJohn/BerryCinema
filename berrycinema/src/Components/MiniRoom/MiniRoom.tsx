import React,{FC} from 'react';

import './miniRoom.scss';

interface MiniRoomProps {
    name: string;
    users: number;
}
 
const MiniRoom: FC<MiniRoomProps> = (props) => {
    return (
    <div className='miniRoom'>
        {props.name}
    </div>
    );
}
 
export default MiniRoom;
