package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.CampaignParameters

class CampaignActionMapper(private val readableMap: ReadableMap?) :
  Mapper<CampaignParameters.CampaignAction> {
  override fun getData(): CampaignParameters.CampaignAction {
    val map = readableMap ?: return CampaignParameters.CampaignAction.CLICK
    val action = map.getInt("action")
    return if (action == 1)
      CampaignParameters.CampaignAction.VIEW
    else
      CampaignParameters.CampaignAction.CLICK
  }
}
