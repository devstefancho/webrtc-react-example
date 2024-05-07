import { FC, useEffect, useRef, useState } from "react";

interface PropTypes {}

const iceConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

interface PropTypes {
  localStream: MediaStream | null;
}

const RemoteStream: FC<PropTypes> = ({ localStream }) => {
  const [pc, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
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
  }, []);

  const handleAddTrackToPeerConnection = async (
    pc: RTCPeerConnection | null
  ) => {
    if (!localStream) {
      return alert("Local Stream is not available");
    }

    if (pc) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }
  };

  const createOffer = async (pc: RTCPeerConnection | null) => {
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  };

  const getOffer = async (pc: RTCPeerConnection | null) => {
    if (!pc) return;
    setOffererSDP(JSON.stringify(pc.localDescription));
  };

  const createAnswer = async (pc: RTCPeerConnection | null) => {
    if (!pc) return;

    const offer = JSON.parse(offererSDP);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
  };

  const getAnswer = async (pc: RTCPeerConnection | null) => {
    if (!pc) return;
    setAnswererSDP(JSON.stringify(pc.localDescription));
  };

  const addAnswer = async (pc: RTCPeerConnection | null) => {
    console.log(pc, pc?.currentRemoteDescription);
    if (pc && !pc.currentRemoteDescription) {
      console.log("addAnswer", answererSDP);
      const answer = JSON.parse(answererSDP);
      await pc.setRemoteDescription(answer);
    }
  };
  return (
    <div>
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
      <div className="flex flex-col gap-[10px]">
        <button onClick={() => handleAddTrackToPeerConnection(pc)}>
          Add track to PeerConnection
        </button>
        <button onClick={() => createOffer(pc)}>(A) Create offer</button>
        <button onClick={() => getOffer(pc)}>(A) offer</button>
        <input
          type="text"
          value={offererSDP}
          onChange={(e) => {
            setOffererSDP(e.target.value);
          }}
        />
        <button onClick={() => createAnswer(pc)}>(B) Create Answer</button>
        <button onClick={() => getAnswer(pc)}>(B) Answer</button>
        <input
          type="text"
          value={answererSDP}
          onChange={(e) => {
            setAnswererSDP(e.target.value);
          }}
        />
        <button onClick={() => addAnswer(pc)}>(A) Add Answer</button>
      </div>
    </div>
  );
};

export default RemoteStream;
