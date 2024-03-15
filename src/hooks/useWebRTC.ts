import React, { useEffect, useRef, useState } from 'react';
import {
  MediaStream,
  RTCPeerConnection,
  mediaDevices,
} from 'react-native-webrtc';

const useWebRTC = () => {
  let remoteRTCMessage = useRef(null);
  // Stream of local user
  const [localStream, setlocalStream] = useState<MediaStream | null>(null);
  /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
  const peerConnection = useRef<any>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  useEffect(() => {
    let isFront = false;

    /*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
    mediaDevices.enumerateDevices().then((sourceInfos: any) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        })
        .then(stream => {
          // Get local stream!
          setlocalStream(stream);

          // setup stream listening
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

    peerConnection.current.onaddstream = (event: any) => {
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    peerConnection.current.onicecandidate = (event: any) => {};

    peerConnection.current.onicecandidate = (event: any) => {
      if (event.candidate) {
        // Alice sends serialized candidate data to Bob using Socket
        // sendICEcandidate({
        //   calleeId: otherUserId.current,
        //   rtcMessage: {
        //     label: event.candidate.sdpMLineIndex,
        //     id: event.candidate.sdpMid,
        //     candidate: event.candidate.candidate,
        //   },
        // });
      } else {
        console.log('End of candidates.');
      }
    };
  }, []);

  return { remoteRTCMessage, peerConnection };
};

export default useWebRTC;
