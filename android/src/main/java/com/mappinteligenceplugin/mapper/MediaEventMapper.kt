package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.MediaEvent
import webtrekk.android.sdk.events.eventParams.ECommerceParameters
import webtrekk.android.sdk.events.eventParams.EventParameters
import webtrekk.android.sdk.events.eventParams.MediaParameters
import webtrekk.android.sdk.events.eventParams.SessionParameters

class MediaEventMapper(private val readableMap: ReadableMap?) : Mapper<MediaEvent> {

  private var eventParameters: EventParameters? = null
  private var eCommerceParameters: ECommerceParameters? = null
  private var sessionParameters: SessionParameters? = null
  private var customParameters: Map<String, String> = emptyMap()
  private var mediaParameters: MediaParameters? = null
  private var pageName: String? = null

  override fun getData(): MediaEvent? {
    val map = readableMap ?: return null

    val params = map.optMap("parameters")

    pageName = map.optString("pageName") ?: ""
    eventParameters = EventParametersMapper(map.optMap("eventParameters")).getData()
    eCommerceParameters = ECommerceParametersMapper(map.optMap("eCommerceParameters")).getData()
    sessionParameters = SessionParametersMapper(map.optMap("sessionParameters")).getData()
    customParameters = map.optMap("customParameters").toMap(keyTransform = { it.toString() })
    mediaParameters = MediaParametersMapper(params).getData()

    val media = mediaParameters ?: return null
    val name = pageName ?: return null
    return MediaEvent(name, media).also {
      it.eventParameters = eventParameters
      it.eCommerceParameters = eCommerceParameters
      it.sessionParameters = sessionParameters
      it.customParameters.putAll(customParameters)
    }
  }
}
