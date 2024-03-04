package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.events.eventParams.UserCategories

class UserCategoriesMapper(private val readableMap: ReadableMap?) : Mapper<UserCategories> {
  override fun getData(): UserCategories? {
    val map = readableMap ?: return null

    val customParams = mutableMapOf<Int, String>()
    map.entryIterator.forEach {
      with(it.key as Int?) {
        this?.let { key ->
          customParams[key] = it.value.toString()
        }
      }
    }
    return UserCategories(customParams)
  }
}
