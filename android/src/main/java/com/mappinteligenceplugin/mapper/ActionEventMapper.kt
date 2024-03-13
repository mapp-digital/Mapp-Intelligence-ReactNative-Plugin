package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import webtrekk.android.sdk.events.ActionEvent

class ActionEventMapper(val readableMap: ReadableMap?) : Mapper<ActionEvent> {
  override fun getData(): ActionEvent? {
    val map = readableMap ?: return null
    val name = map.optString("name") ?: ""
    val eventParameters = EventParametersMapper(map.optMap("eventParameters"))
    val campaignParameters = CampaignParametersMapper(map.optMap("campaignParameters"))
    val ecommerceParameters = ECommerceParametersMapper(map.optMap("ecommerceParameters"))
    val sessionParameters = SessionParametersMapper(map.optMap("sessionParameters"))
    val userCategories = UserCategoriesMapper(map.optMap("userCategories"))

    return ActionEvent(name).apply {
      this.eventParameters = eventParameters.getData()
      this.campaignParameters = campaignParameters.getData()
      this.eCommerceParameters = ecommerceParameters.getData()
      this.sessionParameters = sessionParameters.getData()
      this.userCategories = userCategories.getData()
    }
  }
}
