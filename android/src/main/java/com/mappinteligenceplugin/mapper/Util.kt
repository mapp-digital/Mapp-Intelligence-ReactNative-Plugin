package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

object Util {
//  inline fun <reified K, reified V> ReadableMap?.toMap(): Map<K, V> {
//    val map = mutableMapOf<K, V>()
//    this?.entryIterator?.forEach {
//      val key = it.key as K
//      val value = it.value as? V
//
//      if (key is K && value is V) {
//        map[key] = value
//      }
//    }
//    return map
//  }

  inline fun <K, V> ReadableMap?.toMap(
    keyTransform: (k: Any) -> K, valueTransform: (v: String?) -> V? = { (it as V) }
  ): Map<K, V> {
    val map = mutableMapOf<K, V>()
    val iterator = this?.keySetIterator() ?: return map

    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      val keyItem = keyTransform(key)
      val valueItem = valueTransform(this.getString(key))
      valueItem?.let {
        map[keyItem] = it
      }
    }

    return map
  }

  fun ReadableMap?.optDouble(key: String?): Double? {
    if (this == null || key == null || !this.hasKey(key)) return null
    return try {
      this.getString(key)?.toDoubleOrNull()
    } catch (e: Exception) {
      null
    }
  }

  fun ReadableMap?.optString(key: String?): String? {
    if (this == null || key == null || !this.hasKey(key)) return null
    return this.getString(key)
  }

  fun ReadableMap?.optBoolean(key: String?): Boolean {
    if (this == null || key == null || !this.hasKey(key)) return false
    return this.getBoolean(key)
  }

  fun ReadableMap?.optInt(key: String?): Int {
    if (this == null || key == null || !this.hasKey(key)) return 0
    return try {
      this.getString(key)?.toBigDecimal()?.toInt() ?: 0
    } catch (e: Exception) {
      0
    }
  }

  fun ReadableMap?.optMap(key: String?): ReadableMap? {
    if (this == null || key == null || !this.hasKey(key)) return null
    return this.getMap(key)
  }

  fun ReadableMap?.optArray(key: String?): ReadableArray? {
    if (this == null || key == null || !this.hasKey(key)) return null
    return this.getArray(key)
  }
}
