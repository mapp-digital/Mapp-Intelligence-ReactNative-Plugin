import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import { MediaAction, MediaParam } from '../../src/DataTypes';
import { useNavigation } from '@react-navigation/native';

const VideoPlayer = () => {
  const navigation = useNavigation();

  const sources: MediaSource[] = [
    {
      title: 'Stream',
      url: 'https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8',
    },
    {
      title: 'BigBuckBunny',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      title: 'ElephantDream',
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  const REPEAT_TIME_MS = 5000;

  const videoRef = useRef<VideoRef>(null);

  const [videoIndex, setVideoIndex] = useState(2);

  const [videoProgress, setVideoProgress] = useState<{
    currentTime: number;
    duration: number;
    seekable: number;
  }>({ currentTime: 0, duration: 0, seekable: 0 });

  const [busy, setBusy] = useState(false);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  /**
   * Method to create and send EOF media event
   */
  const onEof = async () => {
    console.log('onEof - started!');
    const params = new Map([
      [MediaParam.media_action, MediaAction.eof.valueOf()],
      [MediaParam.media_position, videoProgress.currentTime.toString()],
      [MediaParam.media_duration, videoProgress.duration.toString()],
    ]);

    await MappIntelligencePlugin.trackMedia(
      params,
      'BigBuckBunny',
      'Video Player'
    );
    console.log('onEof - finished!: ' + [...params.entries()]);
  };

  const onProgressEvent = async (
    current: number,
    playableDuration: number,
    seekableDuration: number
  ) => {
    console.log(
      'Current time: ' +
        current +
        ';  Playable time: ' +
        playableDuration +
        ';  Seekable time: ' +
        seekableDuration
    );

    const params = new Map([
      [MediaParam.media_action, MediaAction.pos.valueOf()],
      [MediaParam.media_position, current.toString()],
      [MediaParam.media_duration, playableDuration.toString()],
    ]);
    await MappIntelligencePlugin.trackMedia(
      params,
      'BigBuckBunny',
      'Video Player'
    );
  };

  /**
   * Listener for playing status; Send play/pause media event.
   * @param isPlaying is true when video is playing; otherwise is false
   */
  const onPlaybackStateChangedEvent = async (isPlaying: boolean) => {
    console.log('Is Playing: ' + isPlaying);
    var action = MediaAction.stop.valueOf();

    if (isPlaying) action = MediaAction.play.valueOf();
    else action = MediaAction.pause.valueOf();

    const params = new Map([
      [MediaParam.media_action, action],
      [MediaParam.media_position, videoProgress.currentTime.toString()],
      [MediaParam.media_duration, videoProgress.duration.toString()],
    ]);

    await MappIntelligencePlugin.trackMedia(
      params,
      'BigBuckBunny',
      'Video Player'
    );
  };

  /**
   * When video loaded, send INIT media event
   * @param currentTime
   * @param duration
   */
  const onLoadEvent = async (currentTime: number, duration: number) => {
    console.log('OnLoad: ');

    const params = new Map([
      [MediaParam.media_position, currentTime.toString()],
      [MediaParam.media_duration, duration.toString()],
      [MediaParam.media_action, MediaAction.init.valueOf()],
    ]);

    await MappIntelligencePlugin.trackMedia(
      params,
      sources[videoIndex]?.title,
      'Video Player'
    );
  };

  // subscribe navigation event when screen is about to unmount
  // send EOF media event
  React.useEffect(() => {
    const unsubscribe: any = navigation.addListener('blur', async () => {
      if (timeoutId) clearTimeout(timeoutId);
      await onEof();

      return unsubscribe;
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        // Can be a URL or a local file.
        source={{ uri: sources[videoIndex]?.url }}
        // Store reference
        ref={videoRef}
        // Callback when video cannot be loaded
        onError={(e) => {
          console.log(e);
        }}
        resizeMode="none"
        style={styles.backgroundVideo}
        controls={true}
        onVolumeChange={(e) => {
          console.log(e);
        }}
        collapsable={false}
        onProgress={(e) => {
          setVideoProgress({
            currentTime: e.currentTime,
            duration: e.playableDuration,
            seekable: e.seekableDuration,
          });
          videoProgress.currentTime = e.currentTime;
          videoProgress.duration = e.playableDuration;
          videoProgress.seekable = e.seekableDuration;
          if (!busy) {
            setBusy(true);
            clearTimeout(timeoutId);
            const timeId = setTimeout(() => {
              if (navigation.isFocused()) {
                onProgressEvent(
                  e.currentTime,
                  e.playableDuration,
                  e.seekableDuration
                );
                setBusy(false);
              }
            }, REPEAT_TIME_MS);
            setTimeoutId(timeId);
          }
        }}
        onLoad={(e) => {
          e.naturalSize.orientation;
          onLoadEvent(e.currentTime, e.duration);
        }}
        onPlaybackStateChanged={(e) => {
          onPlaybackStateChangedEvent(e.isPlaying);
        }}
      />
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
  },
});

interface IMediaSource {
  title: string;
  url: string;
}
type MediaSource = Required<IMediaSource>;

export default VideoPlayer;
