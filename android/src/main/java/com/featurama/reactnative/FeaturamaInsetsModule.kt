package com.featurama.reactnative

import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = FeaturamaInsetsModule.NAME)
class FeaturamaInsetsModule(
    reactContext: ReactApplicationContext
) : NativeFeaturamaInsetsSpec(reactContext) {

    companion object {
        const val NAME = "FeaturamaInsets"
    }

    override fun getName(): String = NAME

    override fun getSafeAreaInsets(): WritableMap {
        val result = Arguments.createMap()
        val activity = currentActivity
        if (activity == null) {
            result.putDouble("top", 0.0)
            result.putDouble("right", 0.0)
            result.putDouble("bottom", 0.0)
            result.putDouble("left", 0.0)
            return result
        }

        val rootView = activity.window.decorView
        val windowInsets = ViewCompat.getRootWindowInsets(rootView)
        val density = reactApplicationContext.resources.displayMetrics.density

        if (windowInsets != null) {
            val insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars()
                    or WindowInsetsCompat.Type.displayCutout()
            )
            result.putDouble("top", (insets.top / density).toDouble())
            result.putDouble("right", (insets.right / density).toDouble())
            result.putDouble("bottom", (insets.bottom / density).toDouble())
            result.putDouble("left", (insets.left / density).toDouble())
        } else {
            result.putDouble("top", 0.0)
            result.putDouble("right", 0.0)
            result.putDouble("bottom", 0.0)
            result.putDouble("left", 0.0)
        }
        return result
    }

    override fun getTypedExportedConstants(): Map<String, Any> {
        val insets = getSafeAreaInsets()
        return mapOf("initialInsets" to insets.toHashMap())
    }
}
