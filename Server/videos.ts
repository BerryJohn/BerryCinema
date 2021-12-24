export interface IVideo{
    link: string;
    thumbnail: string;
    title: string;

    description: string;
    duration: number;
    currentTime: number;

    playing: boolean;
};

export class videos {
    videosArr: IVideo[] = [];

    addVideo(video: IVideo){
        this.videosArr.push(video);
    }
    skipVideo(video: IVideo){
        const newVideos = this.videosArr.filter((e) =>{
            e !== video
        });
        this.videosArr = newVideos;
    }
    shiftVideo(){
        this.videosArr.shift();
    }
    showVideos(){
        return this.videosArr;
    }
    countVideos(){
        return this.videosArr.length;
    }
    currentVideo(){
        if(this.countVideos() > 0)
            return this.videosArr[0];
        else
            return null;
    }
}