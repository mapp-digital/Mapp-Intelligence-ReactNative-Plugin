package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.ActionEvent

class ActionEventMapper(val readableMap: ReadableMap?) : Mapper<ActionEvent> {
  override fun getData(): ActionEvent? {
    val map = readableMap ?: return null
    val name = map.getString("name") ?: ""
    val eventParameters = EventParametersMapper(map.getMap("eventParameters"))
    val campaignParameters = CampaignParametersMapper(map.getMap("campaignParameters"))
    val ecommerceParameters = ECommerceParametersMapper(map.getMap("ecommerceParameters"))
    val sessionParameters = SessionParametersMapper(map.getMap("sessionParameters"))
    val userCategories = UserCategoriesMapper(map.getMap("userCategories"))

    return ActionEvent(name).apply {
      this.eventParameters = eventParameters.getData()
      this.campaignParameters = campaignParameters.getData()
      this.eCommerceParameters = ecommerceParameters.getData()
      this.sessionParameters = sessionParameters.getData()
      this.userCategories = userCategories.getData()
    }
  }
}
