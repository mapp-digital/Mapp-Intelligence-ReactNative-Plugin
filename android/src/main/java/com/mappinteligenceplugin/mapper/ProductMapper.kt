package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optBoolean
import com.mappinteligenceplugin.mapper.Util.optDouble
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.ProductParameters

class ProductMapper(private val readableMap: ReadableMap?) : Mapper<ProductParameters> {
  override fun getData(): ProductParameters? {
    val map=readableMap ?: return null
    val name=map.optString("name") ?: ""
    return ProductParameters(name = name).apply {
      this.cost=map.optDouble("cost") ?: 0.0
      this.quantity=map.optDouble("quantity")
      this.productAdvertiseID=map.optDouble("productAdvertiseID")
      this.productSoldOut=map.optBoolean("productSoldOut")
      this.productVariant=map.optString("productVariant")
      this.categories=map.optMap("categories").toMap()
      this.ecommerceParameters=map.optMap("ecommerceParameters").toMap()
    }
  }
}
