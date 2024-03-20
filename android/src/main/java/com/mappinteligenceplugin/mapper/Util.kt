package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType

object Util {
  inline fun <reified K, reified V> ReadableMap?.toMap(): Map<K, V> {
    val map = mutableMapOf<K, V>()
    this?.entryIterator?.forEach {
      val key = (it.key as? K)
      val value = it.value as? V

      if (key is K && value is V) {
        map[key] = value
      }
    }
    return map
  }

//  inline fun <K, V> ReadableMap?.toMap(): Map<K, V> {
//    val map = mutableMapOf<K, V>()
//    val iterator = this?.keySetIterator() ?: return map
//
//    while (iterator.hasNextKey()) {
//      val key = iterator.nextKey()
//      val type = this.getType(key)
//
//      when (type) {
//        ReadableType.Null -> continue
//        ReadableType.Boolean -> map[key as K] = this.optBoolean(key) as V
//        ReadableType.Number -> map[key as K] = this.optInt(key) as V
//        ReadableType.String -> map[key as K] = this.optString(key) as V
//        ReadableType.Map -> map[key as K] = this.optMap(key) as V
//        ReadableType.Array -> map[key as K] = this.optArray(key) as V
//      }
//    }
//
//    return map
//  }

  fun ReadableMap?.optDouble(key: String?): Double? {
    if (this == null || key == null || !this.hasKey(key)) return null
    return try {
      this.getDouble(key)
    } catch (ignored: Exception) {
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
      this.getInt(key)
    } catch (ignored: Exception) {
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
