package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.MediaEvent
import webtrekk.android.sdk.events.eventParams.MediaParameters

class MediaEventMapper(private val readableMap: ReadableMap?) : Mapper<MediaEvent> {
  override fun getData(): MediaEvent? {
    val map=readableMap ?: return null

    val mediaName = map.getString("mediaName") ?: ""
    val params = map.getMap("mediaParameters")
    val mediaParameters = MediaParameters(
      params?.getString("name") ?: "",
      params?.getString("action") ?: "",
      params?.getString("position")?.toLong() ?: 0,
      params?.getString("duration")?.toLong() ?: 0
    )
    return MediaEvent(mediaName, mediaParameters)
  }
}
