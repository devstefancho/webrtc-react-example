import { FC, useRef } from "react";

interface PropTypes {}

const Index: FC<PropTypes> = () => {
  const handleClick = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.srcObject = stream;
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div>
      <h1 className="mb-[20px]">화면공유 하기</h1>
      <button onClick={handleClick}>화면공유 시작</button>
      <video
        ref={videoRef}
        className="w-[640px] h-[360px] border-gray-400 border-[3px]"
        autoPlay
      ></video>
    </div>
  );
};

export default Index;
