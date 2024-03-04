package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.CampaignParameters

class CampaignParametersMapper(private val readableMap: ReadableMap?) : Mapper<CampaignParameters> {
  override fun getData(): CampaignParameters? {
    val map = readableMap ?: return null

    val campaignId = map.getString("campaignId") ?: ""
    val mediaCode = map.getString("mediaCode") ?: ""
    val action = CampaignActionMapper(map.getMap("action"))
    val customParams = mutableMapOf<Int, String>()
    map.getMap("customParameters")?.entryIterator?.forEach {
      with(it.key as Int?) {
        this?.let { key ->
          customParams[key] = it.value.toString()
        }
      }
    }

    return CampaignParameters(campaignId).apply {
      this.action = action.getData()
      this.mediaCode = mediaCode
      this.customParameters = customParams
    }
  }
}
