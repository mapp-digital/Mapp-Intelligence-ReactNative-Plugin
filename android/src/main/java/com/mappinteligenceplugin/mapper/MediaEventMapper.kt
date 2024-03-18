package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import webtrekk.android.sdk.events.MediaEvent
import webtrekk.android.sdk.events.eventParams.MediaParameters

class MediaEventMapper(private val readableMap: ReadableMap?) : Mapper<MediaEvent> {
  override fun getData(): MediaEvent? {
    val map=readableMap ?: return null

    val mediaName = map.optString("mediaName") ?: ""
    val params = map.optMap("mediaParameters")
    val mediaParameters = MediaParameters(
      params?.optString("name") ?: "",
      params?.optString("action") ?: "",
      params?.optString("position")?.toLong() ?: 0,
      params?.optString("duration")?.toLong() ?: 0
    )
    return MediaEvent(mediaName, mediaParameters)
  }
}
