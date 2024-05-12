import { useRef, useState } from "react";
import RemoteStream from "../../components/RemoteStream";

function BasicPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [userCount, setUserCount] = useState<number>(1);

  const handleLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localVideoRef.current!.srcObject = stream;
    setLocalStream(stream);
  };

  return (
    <>
      <h1>Hello WebRTC</h1>
      <div className="card">
        <h2>User 1 (ME)</h2>
        <div className="flex flex-col gap-[10px]">
          <video
            key="localVideo"
            id="localVideo"
            ref={localVideoRef}
            className="w-[300px] h-[150px] border-white border-2 m-[10px]"
            autoPlay
            playsInline
            loop
            muted
          ></video>
          <button onClick={handleLocalStream}>Get My Local Stream</button>
        </div>
      </div>
      <h2 className="mb-[20px]">Set User Count</h2>
      <div className="flex gap-[10px] items-center justify-center">
        <button
          className="w-[100px]"
          onClick={() => {
            setUserCount((prev) => (prev <= 1 ? 1 : prev - 1));
          }}
        >
          Down
        </button>
        <div className="text-[20px] w-[50px]">{userCount}</div>
        <button
          className="w-[100px]"
          onClick={() => {
            setUserCount((prev) => (prev >= 5 ? 5 : prev + 1));
          }}
        >
          Up
        </button>
      </div>
      {new Array(userCount).fill(0).map((_, index) => {
        return (
          <div className="card" key={index}>
            <h2>Remote User {index + 1}</h2>
            <RemoteStream key={`remote-${index}`} localStream={localStream} />
          </div>
        );
      })}
    </>
  );
}

export default BasicPage;
