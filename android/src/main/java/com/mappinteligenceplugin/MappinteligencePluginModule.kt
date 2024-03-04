package com.mappinteligenceplugin

import androidx.annotation.IntRange
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.ActionEventMapper
import com.mappinteligenceplugin.mapper.MediaEventMapper
import webtrekk.android.sdk.Logger
import webtrekk.android.sdk.TrackingParams
import webtrekk.android.sdk.Webtrekk
import webtrekk.android.sdk.WebtrekkConfiguration
import webtrekk.android.sdk.events.PageViewEvent
import java.math.BigDecimal
import java.util.concurrent.TimeUnit

class MappinteligencePluginModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private lateinit var instance: Webtrekk
  private val configAdapter = ConfigAdapter()

  /**
   * Initialize native SDK with the provided trackIds and trackDomain and with the default other parameters
   */
  @ReactMethod
  fun initWithConfiguration(trackIds: ReadableArray, trackDomain: String, promise: Promise) {
    val ids = trackIds.toArrayList().map { (it as Double).toBigDecimal().toPlainString() }
    configAdapter.trackIds = ids
    configAdapter.trackDomain = trackDomain
    promise.resolve(true)
  }

  /**
   * Enable or disable anonymous tracking
   * When anonymous tracking is enabled, everId will be deleted and not created again while this value stays true
   */
  @ReactMethod
  fun setAnonymousTracking(enabled: Boolean, promise: Promise) {
    runOnPlugin({
      instance.anonymousTracking(enabled)
    }, {
      configAdapter.anonymousTracking = enabled
    })
    promise.resolve(true)
  }

  /**
   * Enable or disable sending appVersion parameter with a every request
   */
  @ReactMethod
  fun setSendAppVersionInEveryRequest(enabled: Boolean, promise: Promise) {
    runOnPlugin({
      instance.setVersionInEachRequest(enabled)
    }, {
      configAdapter.versionInEachRequest = enabled
    })
    promise.resolve(true)
  }

  /**
   * Enable or disable user matching option
   * User matching provides connection between users on Engage and Intelligence systems
   */
  @ReactMethod
  fun setEnableUserMatching(enabled: Boolean, promise: Promise) {
    runOnPlugin({
      instance.setUserMatchingEnabled(enabled)
    }, {
      configAdapter.userMatchingEnabled = enabled
    })
    promise.resolve(true)
  }

  /**
   * Track page with a provided [PageViewEvent]
   */
  @ReactMethod
  fun trackPage(page: ReadableMap, promise: Promise) {
    runOnPlugin({
      instance.trackPage(PageViewEvent(""))
    })
    promise.resolve(true)
  }

  /**
   * Sets log level for a library. Disable or enable logs in the logcat from the intelligence SDK and it's plugin
   */
  @ReactMethod
  fun setLogLevel(level: Int, promise: Promise) {
    val nativeLevel = if (level == Logger.Level.BASIC.ordinal) {
      Logger.Level.BASIC
    } else {
      Logger.Level.NONE
    }
    runOnPlugin({
      instance.setLogLevel(nativeLevel)
    }, {
      configAdapter.logLevel = nativeLevel
    })
    promise.resolve(true)
  }


  /**
   * Enable or disable sending requests in a batch
   * When enabled, multiple track records are send via single Http request
   */
  @ReactMethod
  fun setBatchSupportEnabled(enabled: Boolean, promise: Promise) {
    runOnPlugin({
      instance.setBatchEnabled(enabled)
    }, {
      configAdapter.batchSupport = enabled
    })
    promise.resolve(true)
  }

  /**
   * Sets the number of records to be send in a single network request.
   * Value must be in the defined range for size
   */
  @ReactMethod
  fun setBatchSupportSize(
    @IntRange size: Int,
    promise: Promise
  ) {
    runOnPlugin({
      instance.setRequestPerBatch(size)
    }, {
      configAdapter.requestPerBatch = size
    })
    promise.resolve(true)
  }

  /**
   * Sets time interval, in minutes, for a job of automatic sending of the tracking records
   * Minimum value is 15 minutes, limited by Android OS.
   */
  @ReactMethod
  fun setRequestInterval(
    @IntRange(from = 15) interval: Int,
    promise: Promise
  ) {
    runOnPlugin({
      instance.setRequestInterval(interval.toLong())
    }, {
      configAdapter.requestsIntervalMinutes = interval
    })
    promise.resolve(true)
  }

  /**
   * This operation is not supported on android
   * Method exists only for compatibility
   */
  @ReactMethod
  fun setRequestPerQueue(queue: Int, promise: Promise) {
    promise.resolve(true)
  }

  /**
   * Enable or disable migration from previous version of a native SDK
   * React Native plugin was not developed with a older version (v4) of the native plugin,
   * so migration for this plugin will always stay false.
   */
  @ReactMethod
  fun setShouldMigrate(migrate: Boolean, promise: Promise) {
    runOnPlugin({
      if (migrate) {
        reset { it.enableMigration() }
      }
    }, {
      configAdapter.shouldMigrate = migrate
    })
    promise.resolve(true)
  }

  /**
   * Required only for iOS;
   * Method just returns success and exist only for compatibility
   */
  @ReactMethod
  fun setEnableBackgroundSendout(enabled: Boolean, promise: Promise) {
    promise.resolve(true)
  }

  @ReactMethod
  fun trackCustomPage(pageName: String, params: ReadableMap, promise: Promise) {
    //instance.trackCustomPage(pageName, params)
    runOnPlugin({
      val trackingParams = TrackingParams().apply {

      }
      instance.trackCustomPage(pageName, trackingParams)
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun sendRequestsAndClean(promise: Promise) {
    runOnPlugin({
      instance.sendRequestsNowAndClean()
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackAction(action: ReadableMap, promise: Promise) {
    runOnPlugin({
      ActionEventMapper(action).getData()?.let {
        instance.trackAction(it)
      }
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackException(exception: ReadableMap, promise: Promise) {
    runOnPlugin({
      val innerException = Exception(exception.getString("message"))
      instance.trackException(innerException)

    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackMedia(pageName: String, mediaName: String, params: ReadableMap, promise: Promise) {
    runOnPlugin({
      val trackParams = mutableMapOf<String, String>()
      params.entryIterator.forEach {
        trackParams[it.key] = it.value.toString()
      }
      instance.trackMedia(pageName, mediaName, trackParams)
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackMedia(mediaName: String, params: ReadableMap, promise: Promise) {
    runOnPlugin({
      val trackParams = mutableMapOf<String, String>()
      params.entryIterator.forEach {
        trackParams[it.key] = it.value.toString()
      }
      instance.trackMedia(mediaName, trackParams)
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackMedia(event: ReadableMap, promise: Promise) {
    runOnPlugin({
      MediaEventMapper(event).getData()?.let {
        instance.trackMedia(it)
      }
    })
    promise.resolve(true)
  }

  fun trackUrl() {

  }

  @ReactMethod
  fun build(promise: Promise) {
    runOnPlugin(whenNotInitialized = {
      val builder = WebtrekkConfiguration.Builder(configAdapter.trackIds, configAdapter.trackDomain)
        .logLevel(configAdapter.logLevel)
        .enableCrashTracking(configAdapter.exceptionLogLevel)
        .setBatchSupport(configAdapter.batchSupport, configAdapter.requestPerBatch)
        .requestsInterval(TimeUnit.MINUTES, configAdapter.requestsIntervalMinutes.toLong())
        .sendAppVersionInEveryRequest(configAdapter.versionInEachRequest)

      if (configAdapter.shouldMigrate)
        builder.enableMigration()

      if (!configAdapter.autoTracking)
        builder.disableAutoTracking()

      if (!configAdapter.activityAutoTracking)
        builder.disableActivityAutoTracking()

      if (!configAdapter.fragmentsAutoTracking)
        builder.disableFragmentsAutoTracking()

      Webtrekk.getInstance().init(reactContext.applicationContext, builder.build())

      instance = Webtrekk.getInstance().apply {
        this.anonymousTracking(configAdapter.anonymousTracking)
      }

    }, whenInitialized = {})
    promise.resolve(true)
  }

  private fun runOnPlugin(whenInitialized: () -> Unit, whenNotInitialized: (() -> Unit)? = null) {
    if (::instance.isInitialized) whenInitialized.invoke()
    else whenNotInitialized?.invoke()
  }

  private fun reset(presetAction: (WebtrekkConfiguration.Builder) -> Unit) {
    Webtrekk.reset(reactContext.applicationContext)
    val trackIds = instance.getTrackIds()
    val domain = instance.getTrackDomain()

    instance = Webtrekk.getInstance().apply {
      val builder = WebtrekkConfiguration.Builder(trackIds, domain)
      presetAction.invoke(builder)
      val config = builder.build()
      init(reactContext.applicationContext, config)
    }
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "MappinteligencePlugin"
  }
}
