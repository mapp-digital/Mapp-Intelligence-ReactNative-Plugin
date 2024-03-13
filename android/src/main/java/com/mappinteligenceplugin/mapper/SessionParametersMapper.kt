package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.SessionParameters

class SessionParametersMapper(private val readableMap: ReadableMap?) : Mapper<SessionParameters> {
  override fun getData(): SessionParameters? {
    val map = readableMap ?: return null
    return SessionParameters().apply {
      this.parameters=map.toMap()
    }
  }
}
