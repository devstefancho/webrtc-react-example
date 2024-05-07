import { useRef, useState } from "react";
import "./App.css";
import RemoteStream from "./components/RemoteStream";

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

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
      <div className="card">
        <h2>User 2</h2>
        <RemoteStream key={"remote-1"} localStream={localStream} />
      </div>
      <div className="card">
        <h2>User 3</h2>
        <RemoteStream key={"remote-2"} localStream={localStream} />
      </div>
    </>
  );
}

export default App;
