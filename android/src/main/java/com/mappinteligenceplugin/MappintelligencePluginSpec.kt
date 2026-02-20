// MappintelligencePluginSpec.kt
package com.mappinteligenceplugin

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.turbomodule.core.interfaces.TurboModule

interface MappintelligencePluginSpec : TurboModule {
    fun initWithConfiguration(trackIds: ReadableArray, trackDomain: String, promise: Promise)
    fun isInitialized(promise: Promise)
    fun setAnonymousTracking(enabled: Boolean, promise: Promise)
    fun setSendAppVersionInEveryRequest(enabled: Boolean, promise: Promise)
    fun setEnableUserMatching(enabled: Boolean, promise: Promise)
    fun setEverId(everId: String?, promise: Promise)
    fun getEverId(promise: Promise)
    fun setTemporarySessionId(sessionId: String, promise: Promise)
    fun optOut(sendData: Boolean, promise: Promise)
    fun optIn(sendData: Boolean, promise: Promise)
    fun setExceptionLogLevel(exceptionLevel: Double, promise: Promise)
    fun setLogLevel(level: Double, promise: Promise)
    fun setBatchSupportEnabled(enabled: Boolean, promise: Promise)
    fun setBatchSupportSize(size: Double, promise: Promise)
    fun setRequestInterval(interval: Double, promise: Promise)
    fun setRequestPerQueue(queue: Double, promise: Promise)
    fun setShouldMigrate(migrate: Boolean, promise: Promise)
    fun setEnableBackgroundSendout(enabled: Boolean, promise: Promise)
    fun trackCustomPage(
        pageTitle: String?,
        pageParams: ReadableMap?,
        sessionParams: ReadableMap?,
        userCategoryParams: ReadableMap?,
        ecommerceParams: ReadableMap?,
        campaignParams: ReadableMap?,
        promise: Promise
    )
    fun trackPageWithCustomData(params: ReadableMap?, pageTitle: String, promise: Promise)
    fun trackPage(pageTitle: String, promise: Promise)
    fun sendRequestsAndClean(promise: Promise)
    fun trackAction(
        name: String,
        eventParameters: ReadableMap?,
        sessionParameters: ReadableMap?,
        userCategories: ReadableMap?,
        eCommerceParameters: ReadableMap?,
        campaignParameters: ReadableMap?,
        promise: Promise
    )
    fun trackException(name: String, message: String, stacktrace: String?, promise: Promise)
    fun trackException(exception: ReadableMap, promise: Promise)
    fun trackMedia(readableMap: ReadableMap?, promise: Promise)
    fun trackUrl(url: String, mediaCode: String?, promise: Promise)
    fun trackExceptionWithName(name: String, message: String, stacktrace: String?, promise: Promise)
    fun build(promise: Promise)
    fun reset(promise: Promise)
    fun getCurrentConfig(promise: Promise)
    fun nativeCrash()
}

