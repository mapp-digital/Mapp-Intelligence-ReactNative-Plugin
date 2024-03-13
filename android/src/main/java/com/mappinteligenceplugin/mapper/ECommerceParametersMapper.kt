package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optArray
import com.mappinteligenceplugin.mapper.Util.optDouble
import com.mappinteligenceplugin.mapper.Util.optInt
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.ECommerceParameters
import webtrekk.android.sdk.events.eventParams.ProductParameters

class ECommerceParametersMapper(private val readableMap: ReadableMap?) :
  Mapper<ECommerceParameters> {
  override fun getData(): ECommerceParameters? {
    val map = readableMap ?: return null

    val prodArray=map.optArray("products")
    val products = mutableListOf<ProductParameters>()
    for(i in 0 until (prodArray?.size() ?: 0)){
      val prod=prodArray?.getMap(i)?.let { ProductMapper(it).getData() }
      prod?.let {
        products.add(it)
      }
    }
    val status = map.optInt("status").let {
      when (it) {
        1 -> ECommerceParameters.Status.ADDED_TO_BASKET
        2 -> ECommerceParameters.Status.PURCHASED
        3 -> ECommerceParameters.Status.VIEWED
        4 -> ECommerceParameters.Status.DELETED_FROM_BASKET
        5 -> ECommerceParameters.Status.ADDED_TO_WISHLIST
        6 -> ECommerceParameters.Status.DELETED_FROM_WISHLIST
        7 -> ECommerceParameters.Status.CHECKOUT
        else -> ECommerceParameters.Status.NONE_STATUS
      }
    }
    return ECommerceParameters().apply {
      this.products = products
      this.status = status
      this.currency = map.optString("currency")
      this.orderID = map.optString("orderID")
      this.orderValue = map.optDouble("orderValue")
      this.returningOrNewCustomer = map.optString("returningOrNewCustomer")
      this.returnValue = map.optDouble("returnValue")
      this.cancellationValue = map.optDouble("cancellationValue")
      this.couponValue = map.optDouble("couponValue")
      this.paymentMethod = map.optString("paymentMethod")
      this.shippingServiceProvider = map.optString("shippingServiceProvider")
      this.shippingSpeed = map.optString("shippingSpeed")
      this.shippingCost = map.optDouble("shippingCost")
      this.markUp = map.optDouble("markUp")
      this.orderStatus = map.optString("orderStatus")
      this.customParameters = map.optMap("customParameters").toMap()
    }
  }
}
