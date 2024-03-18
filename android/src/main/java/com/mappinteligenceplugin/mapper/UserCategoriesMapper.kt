package com.mappinteligenceplugin.mapper

import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.Util.optBoolean
import com.mappinteligenceplugin.mapper.Util.optInt
import com.mappinteligenceplugin.mapper.Util.optMap
import com.mappinteligenceplugin.mapper.Util.optString
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.events.eventParams.UserCategories

class UserCategoriesMapper(private val readableMap: ReadableMap?) : Mapper<UserCategories> {
  override fun getData(): UserCategories? {
    val map = readableMap ?: return null

    val birthday = map.optMap("birthday")?.let {
      val d = it.optInt("day")
      val m = it.optInt("month")
      val y = it.optInt("year")
      UserCategories.Birthday(d, m, y)
    }
    val gender = map.optInt("gender").let {
      return@let when (it) {
        2 -> UserCategories.Gender.MALE
        3 -> UserCategories.Gender.FEMALE
        else -> UserCategories.Gender.UNKNOWN
      }
    }

    return UserCategories().apply {
      this.birthday = birthday
      this.city = map.optString("city")
      this.country = map.optString("country")
      this.emailAddress = map.optString("emailAddress")
      this.emailReceiverId = map.optString("emailReceiverId")
      this.firstName = map.optString("firstName")
      this.gender = gender
      this.customerId = map.optString("customerId")
      this.lastName = map.optString("lastName")
      this.newsletterSubscribed = map.optBoolean("newsletterSubscribed")
      this.phoneNumber = map.optString("phoneNumber")
      this.street = map.optString("street")
      this.streetNumber = map.optString("streetNumber")
      this.zipCode = map.optString("zipCode")
      this.customCategories = map.optMap("customCategories").toMap()
    }
  }
}
