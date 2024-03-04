package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.SessionParameters

class SessionParametersMapper(private val readableMap: ReadableMap?) : Mapper<SessionParameters> {
  override fun getData(): SessionParameters? {
    val map = readableMap ?: return null

    val customParams = mutableMapOf<Int, String>()
    map.entryIterator.forEach {
      with(it.key as Int?) {
        this?.let { key ->
          customParams[key] = it.value.toString()
        }
      }
    }
    return SessionParameters(customParams)
  }
}
