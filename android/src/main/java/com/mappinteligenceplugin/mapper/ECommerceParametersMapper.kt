package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.ECommerceParameters

class ECommerceParametersMapper(private val readableMap: ReadableMap?) : Mapper<ECommerceParameters> {
  override fun getData(): ECommerceParameters? {
    val map = readableMap ?: return null

    val customParams = mutableMapOf<Int, String>()
    map.entryIterator.forEach {
      with(it.key as Int?) {
        this?.let { key ->
          customParams[key] = it.value.toString()
        }
      }
    }

    return ECommerceParameters(customParams)
  }
}
