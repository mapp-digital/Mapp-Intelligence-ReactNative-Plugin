package com.mappinteligenceplugin

import android.net.Uri
import android.util.Log
import androidx.annotation.IntRange
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.mappinteligenceplugin.mapper.CampaignParametersMapper
import com.mappinteligenceplugin.mapper.ECommerceParametersMapper
import com.mappinteligenceplugin.mapper.EventParametersMapper
import com.mappinteligenceplugin.mapper.ExceptionTypeMapper
import com.mappinteligenceplugin.mapper.MediaEventMapper
import com.mappinteligenceplugin.mapper.PageParametersMapper
import com.mappinteligenceplugin.mapper.SessionParametersMapper
import com.mappinteligenceplugin.mapper.UserCategoriesMapper
import com.mappinteligenceplugin.mapper.Util.toMap
import webtrekk.android.sdk.Logger
import webtrekk.android.sdk.Webtrekk
import webtrekk.android.sdk.WebtrekkConfiguration
import webtrekk.android.sdk.events.ActionEvent
import webtrekk.android.sdk.events.PageViewEvent
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
    val trackValues = mutableListOf<Double?>()
    for (i in 0 until trackIds.size()) {
      trackValues.add(trackIds.getDouble(i))
    }
    val ids = trackValues.mapNotNull { it?.toBigDecimal()?.toPlainString() }
    runOnPlugin(whenInitialized = {
      instance.setIdsAndDomain(ids, trackDomain)
    }, whenNotInitialized = {
      configAdapter.trackIds = ids
      configAdapter.trackDomain = trackDomain
    })
    promise.resolve(true)
  }

  /**
   * Check if SDK is initialized and ready for usage
   * Returns true if initialization was finished, otherwise false
   */
  @ReactMethod
  fun isInitialized(promise: Promise) {
    runOnPlugin(whenInitialized = {
      promise.resolve(true)
    }, whenNotInitialized = {
      promise.resolve(false)
    })
  }

  /**
   * Enable or disable anonymous tracking
   * When anonymous tracking is enabled, everId will be deleted and not created again while this value stays true
   */
  @ReactMethod
  fun setAnonymousTracking(enabled: Boolean, promise: Promise) {
    runOnPlugin(
      whenInitialized = {
        instance.anonymousTracking(enabled)
      }, whenNotInitialized = {
        configAdapter.anonymousTracking = enabled
      })
    promise.resolve(true)
  }

  /**
   * Enable or disable sending appVersion parameter with a every request
   */
  @ReactMethod
  fun setSendAppVersionInEveryRequest(enabled: Boolean, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.setVersionInEachRequest(enabled)
    }, whenNotInitialized = {
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
    runOnPlugin(whenInitialized = {
      instance.setUserMatchingEnabled(enabled)
    }, whenNotInitialized = {
      configAdapter.userMatchingEnabled = enabled
    })
    promise.resolve(true)
  }

  /**
   * Set custom everId
   * If null or empty string passed, everId will be autogenerated
   * <b>It has effect only if anonymous tracking is disabled</b>
   */
  @ReactMethod
  fun setEverId(everId: String?, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.setEverId(everId)
    }, whenNotInitialized = {
      configAdapter.everId = everId
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun getEverId(promise: Promise) {
    runOnPlugin(whenInitialized = {
      val everId = instance.getEverId()
      promise.resolve(everId)
    }, whenNotInitialized = {
      promise.reject("", "SDK not initialized yet!")
    })
  }

  @ReactMethod
  fun setTemporarySessionId(sessionId: String, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.setTemporarySessionId(sessionId)
    }, whenNotInitialized = {
      configAdapter.temporarySessionId = sessionId
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun optOut(sendData: Boolean, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.optOut(true, sendData)
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun optIn(sendData: Boolean, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.optOut(false, sendData)
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun setExceptionLogLevel(exceptionLevel: Double, promise: Promise) {
    val exceptionType = ExceptionTypeMapper(exceptionLevel).getData()
    runOnPlugin(whenInitialized = {
      instance.setExceptionLogLevel(exceptionType)
    }, whenNotInitialized = {
      configAdapter.exceptionLogLevel = exceptionType
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
    runOnPlugin(whenInitialized = {
      instance.setLogLevel(nativeLevel)
    }, whenNotInitialized = {
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
    runOnPlugin(whenInitialized = {
      instance.setBatchEnabled(enabled)
    }, whenNotInitialized = {
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
    @IntRange size: Int, promise: Promise
  ) {
    runOnPlugin(
      whenInitialized = {
        instance.setRequestPerBatch(size)
      }, whenNotInitialized = {
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
    @IntRange(from = 15) interval: Int, promise: Promise
  ) {
    runOnPlugin(
      whenInitialized = {
        instance.setRequestInterval(interval.toLong())
      }, whenNotInitialized = {
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
    runOnPlugin(
      whenInitialized = {
        if (migrate) {
          reset { it.enableMigration() }
        }
      }, whenNotInitialized = {
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
  fun trackCustomPage(
    pageTitle: String,
    pageParams: ReadableMap?,
    sessionParams: ReadableMap?,
    userCategoryParams: ReadableMap?,
    ecommerceParams: ReadableMap?,
    campaignParams: ReadableMap?,
    promise: Promise
  ) {
    runOnPlugin(
      whenInitialized = {
        val page = PageParametersMapper(pageParams).getData()
        val session = SessionParametersMapper(sessionParams).getData()
        val userCat = UserCategoriesMapper(userCategoryParams).getData()
        val ecommerce = ECommerceParametersMapper(ecommerceParams).getData()
        val campaign = CampaignParametersMapper(campaignParams).getData()

        val pageViewEvent = PageViewEvent(pageTitle).apply {
          this.pageParameters = page
          this.sessionParameters = session
          this.userCategories = userCat
          this.eCommerceParameters = ecommerce
          this.campaignParameters = campaign
        }
        instance.trackPage(pageViewEvent)
      }
    )
    promise.resolve(true)
  }

  /**
   * Track page with a provided [PageViewEvent]
   */
  @ReactMethod
  fun trackPageWithCustomData(params: ReadableMap?, pageTitle: String, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.trackCustomPage(pageTitle, params.toMap(keyTransform = {it.toString()}))
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackPage(pageTitle: String, promise: Promise) {
    runOnPlugin(whenInitialized = {
      instance.trackPage(PageViewEvent(pageTitle))
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun sendRequestsAndClean(promise: Promise) {
    runOnPlugin(
      whenInitialized = {
        instance.sendRequestsNowAndClean()
      })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackAction(
    name: String,
    eventParameters: ReadableMap?,
    sessionParameters: ReadableMap?,
    userCategories: ReadableMap?,
    eCommerceParameters: ReadableMap?,
    campaignParameters: ReadableMap?,
    promise: Promise
  ) {
    runOnPlugin(
      whenInitialized = {
        val event = EventParametersMapper(eventParameters).getData()
        val session = SessionParametersMapper(sessionParameters).getData()
        val userCat = UserCategoriesMapper(userCategories).getData()
        val ecommerce = ECommerceParametersMapper(eCommerceParameters).getData()
        val campaignParams = CampaignParametersMapper(campaignParameters).getData()
        val actionEvent = ActionEvent(name).apply {
          this.eventParameters = event
          this.sessionParameters = session
          this.userCategories = userCat
          this.eCommerceParameters = ecommerce
          this.campaignParameters = campaignParams
        }
        instance.trackAction(actionEvent)
      })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackException(exception: ReadableMap, promise: Promise) {
    runOnPlugin(
      whenInitialized = {
        val innerException = Exception(exception.getString("message"))
        instance.trackException(innerException)

      })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackCustomMedia(
    pageName: String?,
    mediaName: String,
    params: ReadableMap,
    promise: Promise
  ) {
    runOnPlugin(
      whenInitialized = {
        val trackParams = params.toMap(keyTransform={it.toString()},valueTransform={it.toString()})
        if (pageName != null) {
          instance.trackMedia(pageName, mediaName, trackParams)
        } else {
          instance.trackMedia(mediaName, trackParams)
        }
      })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackMedia(readableMap: ReadableMap?, promise: Promise) {
    runOnPlugin(whenInitialized = {
      MediaEventMapper(readableMap).getData()?.let {
        instance.trackMedia(it)
      }
    })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackUrl(url: String, mediaCode: String?, promise: Promise) {
    runOnPlugin(
      whenInitialized = {
        instance.trackUrl(Uri.parse(url), mediaCode)
      })
    promise.resolve(true)
  }

  @ReactMethod
  fun trackException(name: String, message: String, stacktrace: String?=null, promise: Promise) {
    runOnPlugin(whenInitialized = {
      Log.d("MappIntelligencePlugin", "trackException")
      if (stacktrace.isNullOrEmpty()) {
        instance.trackException(name, message)
      } else {
        instance.trackException(name, message + "\n${stacktrace}")
      }
    })
    promise.resolve(true)
  }

  /**
   * Configure webtrekk SDK and initialize it
   */
  @ReactMethod
  fun build(promise: Promise) {
    runOnPlugin(whenNotInitialized = {
      val builder = WebtrekkConfiguration.Builder(configAdapter.trackIds, configAdapter.trackDomain)
        .logLevel(configAdapter.logLevel).enableCrashTracking(configAdapter.exceptionLogLevel)
        .setBatchSupport(configAdapter.batchSupport, configAdapter.requestPerBatch)
        .requestsInterval(TimeUnit.MINUTES, configAdapter.requestsIntervalMinutes.toLong())
        .setEverId(configAdapter.everId)
        .sendAppVersionInEveryRequest(configAdapter.versionInEachRequest)

      if (configAdapter.shouldMigrate) builder.enableMigration()

      if (!configAdapter.autoTracking) builder.disableAutoTracking()

      if (!configAdapter.activityAutoTracking) builder.disableActivityAutoTracking()

      if (!configAdapter.fragmentsAutoTracking) builder.disableFragmentsAutoTracking()

      Webtrekk.getInstance().init(reactContext.applicationContext, builder.build())

      instance = Webtrekk.getInstance().apply {
        this.anonymousTracking(configAdapter.anonymousTracking)
        this.setTemporarySessionId(configAdapter.temporarySessionId)
        this.setExceptionLogLevel(configAdapter.exceptionLogLevel)
      }
    }, whenInitialized = {})
    promise.resolve(true)
  }

  /**
   * Helper function to execute actions based on Webtrekk instance state
   * Provide two functions as input parameters to be executed if instance is initialized or not
   */
  private fun runOnPlugin(whenInitialized: () -> Unit, whenNotInitialized: (() -> Unit)? = null) {
    if (::instance.isInitialized) whenInitialized.invoke()
    else whenNotInitialized?.invoke()
  }

  @ReactMethod
  private fun reset(promise: Promise) {
    runOnPlugin(whenInitialized = {
      reset { }
    })
    promise.resolve(true)
  }

  /**
   * Reset underlying SDK and set new values via
   * @param presetAction - action that has access to WebtrekkConfiguration Builder
   * to change existing configuration and set new values
   */
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
