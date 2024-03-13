package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.PageParameters

class PageParametersMapper(private val readableMap: ReadableMap?) : Mapper<PageParameters> {
  override fun getData(): PageParameters? {
    val map = readableMap ?: return null

    return PageParameters().apply {
      this.search = map.optString("searchTerm") ?: ""
      this.parameters = map.optMap("params").toMap()
      this.pageCategory = map.optMap("categories").toMap()
    }
  }
}
