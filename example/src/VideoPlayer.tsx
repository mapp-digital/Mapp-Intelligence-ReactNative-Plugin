import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import * as MappIntelligencePlugin from 'react-native-mappinteligence-plugin';
import { MediaParam } from '../../src/DataTypes';

const VideoPlayer = () => {
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

  const [busy, setBusy] = useState(false);
  const [videoIndex, setVideoIndex] = useState(2);

  const onError = (error?: string | null, target?: number | null) => {
    console.log('Error: ' + error + ';  Target: ' + target);
  };

  const onVolumeChangedEvent = (volume: number) => {
    console.log('OnVolumeChanged: ' + volume);
  };

  const onProgressEvent = (
    current: number,
    playable: number,
    seekable: number
  ) => {
    console.log(
      'Current time: ' +
        current +
        ';  Playable time: ' +
        playable +
        ';  Seekable time: ' +
        seekable
    );

    const params = new Map([
      [MediaParam.media_action, 'onProgressChanged'],
      [MediaParam.media_position, current.toString()],
    ]);
    MappIntelligencePlugin.trackMedia(params, 'BigBuckBunny', 'Video Player');
  };

  const onPlaybackStateChangedEvent = (isPlaying: boolean) => {
    console.log('Is Playing: ' + isPlaying);
    const params = new Map([
      [MediaParam.media_action, isPlaying ? 'play' : 'pause'],
    ]);
    MappIntelligencePlugin.trackMedia(params, 'BigBuckBunny', 'Video Player');
  };

  const onLoadEvent = (
    currentTime: number,
    duration: number,
    width: number,
    height: number,
    orientation?: string | null
  ) => {
    console.log('OnLoad: ');

    const params = new Map([
      [MediaParam.media_position, currentTime.toString()],
      [MediaParam.media_duration, duration.toString()],
      [MediaParam.media_action, 'onLoad'],
    ]);
    MappIntelligencePlugin.trackMedia(
      params,
      sources[videoIndex]?.title,
      'Video Player'
    );
  };

  return (
    <View style={styles.container}>
      <Video
        // Can be a URL or a local file.
        source={{ uri: sources[videoIndex]?.url }}
        // Store reference
        ref={videoRef}
        // Callback when video cannot be loaded
        onError={(e) => {
          onError(e.error.errorString, e.target);
        }}
        resizeMode="none"
        style={styles.backgroundVideo}
        controls={true}
        onVolumeChange={(e) => {
          onVolumeChangedEvent(e.volume);
        }}
        collapsable={false}
        onProgress={(e) => {
          if (!busy) {
            setBusy(true);
            setTimeout(() => {
              onProgressEvent(
                e.currentTime,
                e.playableDuration,
                e.seekableDuration
              );
              setBusy(false);
            }, REPEAT_TIME_MS);
          }
        }}
        onLoad={(e) => {
          e.naturalSize.orientation;
          onLoadEvent(
            e.currentTime,
            e.duration,
            e.naturalSize.width,
            e.naturalSize.height,
            e.naturalSize.orientation
          );
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
