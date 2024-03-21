package com.mappinteligenceplugin.mapper

import webtrekk.android.sdk.ExceptionType

class ExceptionTypeMapper(private val level: Double) : Mapper<ExceptionType> {
  override fun getData(): ExceptionType {
    return try {
      ExceptionType.values()[level.toBigDecimal().toInt()]
    } catch (e: Exception) {
      ExceptionType.NONE
    }
  }
}
