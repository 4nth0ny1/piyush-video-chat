import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div>
      <h2>Room Page</h2>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            height="100px"
            width="200px"
            playing
            muted
            url={myStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
