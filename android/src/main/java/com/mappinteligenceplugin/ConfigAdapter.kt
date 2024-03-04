package com.mappinteligenceplugin

import webtrekk.android.sdk.ExceptionType
import webtrekk.android.sdk.Logger
import webtrekk.android.sdk.data.model.GenerationMode

data class ConfigAdapter(
  var trackIds: List<String> = emptyList(),
  var trackDomain: String = "",
  var anonymousTracking: Boolean = false,
  var logLevel: Logger.Level = Logger.Level.NONE,
  var requestsIntervalMinutes: Int = 15,
  var autoTracking: Boolean = true,
  var fragmentsAutoTracking: Boolean = true,
  var requestPerBatch: Int = 1000,
  var batchSupport: Boolean = false,
  var activityAutoTracking: Boolean = true,
  var exceptionLogLevel: ExceptionType = ExceptionType.NONE,
  var shouldMigrate: Boolean = false,
  var versionInEachRequest: Boolean = false,
  var everId: String? = null,
  var userMatchingEnabled: Boolean = false,
  var everIdMode: GenerationMode? = GenerationMode.AUTO_GENERATED,
)
