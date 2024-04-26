import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { SocketContext } from 'providers/socket';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import { RootStackParamList } from 'utils/types';
import CallSendModel from './components/CallSendModel';
import Footer from './components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoCall'>;

const VideCall = ({ route: { params }, navigation }: Props) => {
  let remoteRTCMessage = useRef(null);
  const [localStream, setlocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);

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

  const socket = useContext(SocketContext);
  const [isCallStarted, setCallStarted] = useState(false);

  const processCall = async (type: 'SEND' | 'RECEIVE') => {
    const userDetails = await AsyncStorage.getItem('userDetails');
    const data = JSON.parse(userDetails || '{}').data || '';
    if (data.id) {
      /*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */

      peerConnection.current.onaddstream = (event: any) => {
        setRemoteStream(event.stream);
      };
      peerConnection.current.onicecandidate = (event: any) => {
        // console.log('🚀 onicecandidate------------------:', event);
        if (event.candidate) {
          socket.emit('ICEcandidate', {
            chatRoomId: params?.chatRoomId,
            rtcMessage: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            },
          });
        } else {
          console.log('End of candidates.');
        }
      };

      setTimeout(async () => {
        if (type === 'SEND') {
          const sessionDescription = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(sessionDescription);

          socket.emit('call', {
            chatRoomId: params?.chatRoomId,
            callerId: data.id,
            rtcMessage: sessionDescription,
          });
          socket.on('callAnswered', data => {
            setCallStarted(true);
            remoteRTCMessage.current = data.rtcMessage;

            if (remoteRTCMessage.current)
              peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(remoteRTCMessage.current),
              );
          });
        } else {
          if (params?.rtcMessage) remoteRTCMessage.current = params.rtcMessage;
          if (remoteRTCMessage.current)
            peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(remoteRTCMessage.current),
            );
          const sessionDescription =
            await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(sessionDescription);
          socket.emit('answerCall', {
            chatRoomId: params?.chatRoomId,
            callerId: data.id,
            rtcMessage: sessionDescription,
          });
        }
      }, 300);
    }
  };

  const endCall = () => {
    peerConnection.current.close();
    localStream?.getTracks().forEach(track => track.stop());
    setlocalStream(null);
    navigation.pop();
  };

  useEffect(() => {
    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;
      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then((data: any) => {
            console.log('SUCCESS ICE');
          })
          .catch((err: any) => {
            console.log('Error ICE', err);
          });
      }
    });
    socket.on('endAnswered', () => {
      endCall();
    });
  }, [peerConnection?.current]);

  useEffect(() => {
    mediaDevices.enumerateDevices().then((sourceInfos: any) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == 'user') {
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
            facingMode: 'user',
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        })
        .then(stream => {
          // Get local stream!
          setlocalStream(stream);

          // setup stream listening
          if (peerConnection.current) peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
          console.log('AAAAAA------error', error);
        });
    });

    if (params?.type) processCall(params.type);
  }, [params?.type]);

  const onAction = (type: string) => {
    if (type === 'TOGGLE_CAMERA') {
      localStream?.getVideoTracks().forEach(track => {
        track._switchCamera();
      });
    }
    if (type === 'TOGGLE_MIC_MODE') {
      setlocalMicOn(e => {
        localStream?.getAudioTracks().forEach(track => {
          e ? (track.enabled = false) : (track.enabled = true);
        });
        return !e;
      });
    }
    if (type === 'TOGGLE_CAMERA_MODE') {
      setlocalWebcamOn(e => !e);
      localStream?.getVideoTracks().forEach(track => {
        localWebcamOn ? (track.enabled = false) : (track.enabled = true);
      });
    }

    if (type === 'END_CALL') {
      endCall();
      socket.emit('endCall', {
        chatRoomId: params?.chatRoomId,
      });
    }
  };

  return (
    <Layout className="relative flex-1 h-screen">
      {remoteStream ? (
        <RTCView
          objectFit={'cover'}
          style={{
            flex: 1,
            backgroundColor: '#00ff00',
          }}
          streamURL={remoteStream.toURL()}
        />
      ) : null}

      <View className="absolute z-10 h-[180px] w-[120px] right-[20px] bottom-[110px] rounded-md overflow-hidden">
        {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{
              flex: 1,

              backgroundColor: '#ffaaaa',
            }}
            streamURL={localStream.toURL()}
          />
        ) : null}
      </View>
      <View className="absolute bottom-0 left-0 right-0 ">
        <Footer
          videoEnabled={localWebcamOn}
          audioEnabled={localMicOn}
          onAction={onAction}
        />
      </View>
      {params?.type === 'SEND' && !isCallStarted && (
        <CallSendModel
          stream={localStream}
          open={!isCallStarted}
          setOpen={setCallStarted}
          onAction={onAction}
          config={params}
        />
      )}
    </Layout>
  );
};

export default memo(VideCall);
