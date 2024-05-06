import { useEffect, useRef, useState } from "react";
import "./App.css";

const iceConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [pc, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [offererSDP, setOffererSDP] = useState<string>("");
  const [answererSDP, setAnswererSDP] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const pc = new RTCPeerConnection(iceConfiguration);
      setPeerConnection(pc);

      pc.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
          const remoteStream = new MediaStream();
          remoteStream.addTrack(track);
          remoteVideoRef.current!.srcObject = remoteStream;
        });
      };

      pc.onicecandidate = (event) => {
        console.log("onicecandidate", event);
      };
    };

    init();

    return () => {
      if (pc) {
        pc.close();
      }
    };
  }, []);

  const handleLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localVideoRef.current!.srcObject = stream;
  };

  const handleAddTrackToPeerConnection = async () => {
    const stream = localVideoRef.current!.srcObject as MediaStream;
    if (!stream) {
      return alert("Local Stream is not available");
    }

    if (pc) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }
  };

  const createOffer = async () => {
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  };

  const getOffer = async () => {
    if (!pc) return;
    setOffererSDP(JSON.stringify(pc.localDescription));
  };

  const createAnswer = async () => {
    if (!pc) return;

    const offer = JSON.parse(offererSDP);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
  };

  const getAnswer = async () => {
    if (!pc) return;
    setAnswererSDP(JSON.stringify(pc.localDescription));
  };

  const addAnswer = async () => {
    if (pc && !pc.currentRemoteDescription) {
      const answer = JSON.parse(answererSDP);
      await pc.setRemoteDescription(answer);
    }
  };

  return (
    <>
      <h1>Hello WebRTC</h1>
      <div className="card">
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
          <video
            key="remoteVideo"
            id="remoteVideo"
            ref={remoteVideoRef}
            className="w-[300px] h-[150px] border-white border-2 m-[10px]"
            autoPlay
            playsInline
            loop
            muted
          ></video>
        </div>
        <div className="flex flex-col gap-[10px]">
          <button onClick={handleLocalStream}>Get My Local Stream</button>
          <button onClick={handleAddTrackToPeerConnection}>
            Add track to PeerConnection
          </button>
          <button onClick={createOffer}>(A) Create offer</button>
          <button onClick={getOffer}>(A) offer</button>
          <input
            type="text"
            value={offererSDP}
            onChange={(e) => {
              setOffererSDP(e.target.value);
            }}
          />
          <button onClick={createAnswer}>(B) Create Answer</button>
          <button onClick={getAnswer}>(B) Answer</button>
          <input
            type="text"
            value={answererSDP}
            onChange={(e) => {
              setAnswererSDP(e.target.value);
            }}
          />
          <button onClick={addAnswer}>(A) Add Answer</button>
        </div>
      </div>
    </>
  );
}

export default App;
