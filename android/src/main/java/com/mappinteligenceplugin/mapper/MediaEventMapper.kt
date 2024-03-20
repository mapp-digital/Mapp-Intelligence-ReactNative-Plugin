package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optBoolean
import com.mappinteligenceplugin.mapper.Util.optDouble
import com.mappinteligenceplugin.mapper.Util.optInt
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.MediaEvent
import webtrekk.android.sdk.events.eventParams.ECommerceParameters
import webtrekk.android.sdk.events.eventParams.EventParameters
import webtrekk.android.sdk.events.eventParams.MediaParameters
import webtrekk.android.sdk.events.eventParams.SessionParameters

class MediaEventMapper() : Mapper<MediaEvent> {

  private var eventParameters: EventParameters? = null
  private var eCommerceParameters: ECommerceParameters? = null
  private var sessionParameters: SessionParameters? = null
  private var customParameters: Map<String, String> = emptyMap()
  private var mediaParameters: MediaParameters? = null
  private var pageName: String? = null

  constructor(readableMap: ReadableMap?) : this() {
    val map = readableMap ?: return

    val params = map.optMap("parameters")

    pageName = map.optString("pageName") ?: ""
    eventParameters = EventParametersMapper(map.optMap("eventParameters")).getData()
    eCommerceParameters = ECommerceParametersMapper(map.optMap("eCommerceParameters")).getData()
    sessionParameters = SessionParametersMapper(map.optMap("sessionParameters")).getData()
    customParameters = map.optMap("customParameters").toMap<String, String>()
    mediaParameters = MediaParametersMapper(params).getData()
  }

  constructor(
    pageName: String,
    mediaParam: ReadableMap?,
    eventParam: ReadableMap?,
    sessionParam: ReadableMap?,
    ecommerceParam: ReadableMap?,
    customParam: ReadableMap?
  ):this(){
    this.pageName=pageName
    this.mediaParameters=MediaParametersMapper(mediaParam).getData()
    this.eventParameters=EventParametersMapper(eventParam).getData()
    this.sessionParameters=SessionParametersMapper(sessionParam).getData()
    this.eCommerceParameters=ECommerceParametersMapper(ecommerceParam).getData()
    this.customParameters=customParam.toMap()
  }

  override fun getData(): MediaEvent? {
    val media = mediaParameters ?: return null
    val name = pageName ?: return null
    return MediaEvent(name, media).apply {
      this.eventParameters = eventParameters
      this.eCommerceParameters = eCommerceParameters
      this.sessionParameters = sessionParameters
      this.customParameters.putAll(customParameters)
    }
  }
}
