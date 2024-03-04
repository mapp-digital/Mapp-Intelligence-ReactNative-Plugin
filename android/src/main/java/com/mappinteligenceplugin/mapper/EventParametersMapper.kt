package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.EventParameters

class EventParametersMapper(private val readableMap: ReadableMap?) : Mapper<EventParameters> {
  override fun getData(): EventParameters? {
    val map = readableMap ?: return null
    val customParams = mutableMapOf<Int, String>()
    map.entryIterator.forEach {
      with(it.key as Int?) {
        this?.let { key ->
          customParams[key] = it.value.toString()
        }
      }
    }
    return EventParameters(customParameters = customParams)
  }
}
