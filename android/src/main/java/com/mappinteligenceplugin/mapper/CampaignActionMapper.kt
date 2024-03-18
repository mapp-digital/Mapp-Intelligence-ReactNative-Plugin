package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optInt
import webtrekk.android.sdk.events.eventParams.CampaignParameters

class CampaignActionMapper(private val readableMap: ReadableMap?) :
  Mapper<CampaignParameters.CampaignAction> {
  override fun getData(): CampaignParameters.CampaignAction {
    val map = readableMap ?: return CampaignParameters.CampaignAction.CLICK
    val action = map.optInt("action")
    return if (action == 1)
      CampaignParameters.CampaignAction.CLICK
    else
      CampaignParameters.CampaignAction.VIEW
  }
}
