package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.EventParameters

class EventParametersMapper(private val readableMap: ReadableMap?) : Mapper<EventParameters> {
  override fun getData(): EventParameters? {
    val map = readableMap ?: return null
    return EventParameters().apply {
      this.customParameters = map.optMap("customParameters").toMap()
    }
  }
}
