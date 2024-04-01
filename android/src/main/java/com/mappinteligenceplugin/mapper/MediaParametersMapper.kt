package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optBoolean
import com.mappinteligenceplugin.mapper.Util.optDouble
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.MediaParameters

class MediaParametersMapper(private val readableMap: ReadableMap?) : Mapper<MediaParameters> {
  override fun getData(): MediaParameters? {
    val map = readableMap ?: return null

    return MediaParameters(
      map.optString("name") ?: "",
      map.optString("action") ?: "",
      map.optDouble("position")?.toLong() ?: 0,
      map.optDouble("duration")?.toLong() ?: 0,
    ).apply {
      this.bandwith = map.optDouble("bandwith")
      this.soundIsMuted = map.optBoolean("soundIsMuted")
      this.soundVolume = map.optDouble("soundVolume")?.toInt()
      this.customCategories = map.optMap("customCategories").toMap(keyTransform = {
        it.toString().toInt()
      })
    }
  }
}
