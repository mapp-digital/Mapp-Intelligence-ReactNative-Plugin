package com.mappinteligenceplugin

import androidx.annotation.IntRange
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import webtrekk.android.sdk.Logger
import webtrekk.android.sdk.Webtrekk
import webtrekk.android.sdk.WebtrekkConfiguration
import webtrekk.android.sdk.events.PageViewEvent

class MappinteligencePluginModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  lateinit var instance: Webtrekk
  private var anonymousTracking: Boolean = false

  /**
   * Initialize native SDK with the provided trackIds and trackDomain and with the default other parameters
   */
  @ReactMethod
  fun initWithConfiguration(trackIds: ReadableArray, trackDomain: String,promise: Promise) {
    val ids = trackIds.toArrayList().map { it.toString() }
    val configuration = WebtrekkConfiguration.Builder(ids, trackDomain)
      .build()
    instance = Webtrekk.getInstance()
    instance.init(context = reactContext, config = configuration)
    instance.anonymousTracking(anonymousTracking)
    promise.resolve(true)
  }

  /**
   * Enable or disable anonymous tracking
   * When anonymous tracking is enabled, everId will be deleted and not created again while this value stays true
   */
  @ReactMethod
  fun setAnonymousTracking(enabled: Boolean, promise: Promise) {
    this.anonymousTracking = enabled
    promise.resolve(true)
  }

  /**
   * Enable or disable sending appVersion parameter with a every request
   */
  @ReactMethod
  fun setSendAppVersionInEveryRequest(enabled: Boolean, promise: Promise) {
    instance.setVersionInEachRequest(enabled)
    promise.resolve(true)
  }

  /**
   * Enable or disable user matching option
   * User matching provides connection between users on Engage and Intelligence systems
   */
  @ReactMethod
  fun setEnableUserMatching(enabled: Boolean, promise: Promise) {
    instance.setUserMatchingEnabled(enabled)
    promise.resolve(true)
  }

  /**
   * Track page with a provided [PageViewEvent]
   */
  @ReactMethod
  fun trackPage(page: ReadableMap, promise: Promise) {
    //instance.trackPage(page)
    promise.resolve(true)
  }

  /**
   * Sets log level for a library. Disable or enable logs in the logcat from the intelligence SDK and it's plugin
   */
  @ReactMethod
  fun setLogLevel(level: Int, promise: Promise) {
    if (level == Logger.Level.BASIC.ordinal) {
      instance.setLogLevel(Logger.Level.BASIC)
    } else {
      instance.setLogLevel(Logger.Level.NONE)
    }
    promise.resolve(true)
  }


  /**
   * Enable or disable sending requests in a batch
   * When enabled, multiple track records are send via single Http request
   */
  @ReactMethod
  fun setBatchSupportEnabled(enabled: Boolean, promise: Promise) {
    instance.setBatchEnabled(enabled)
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
    instance.setRequestPerBatch(size)
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
    instance.setRequestInterval(interval.toLong())
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
    if (migrate) {
      reset { it.enableMigration() }
    }
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
    promise.resolve(true)
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
