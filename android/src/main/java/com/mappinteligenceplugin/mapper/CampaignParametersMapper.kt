package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optBoolean
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.CampaignParameters

class CampaignParametersMapper(private val readableMap: ReadableMap?) : Mapper<CampaignParameters> {
  override fun getData(): CampaignParameters? {
    val map = readableMap ?: return null

    val campaignId = map.optString("campaignId") ?: ""
    val mediaCode = map.optString("mediaCode") ?: ""
    val oncePerSession = map.optBoolean("oncePerSession") ?: false
    val action = CampaignActionMapper(map).getData()

    return CampaignParameters().apply {
      this.campaignId = campaignId
      this.action = action
      this.mediaCode = mediaCode
      this.oncePerSession = oncePerSession
      this.customParameters = map.getMap("customParameters").toMap(keyTransform = {
        it.toString().toInt()
      })
    }
  }
}
