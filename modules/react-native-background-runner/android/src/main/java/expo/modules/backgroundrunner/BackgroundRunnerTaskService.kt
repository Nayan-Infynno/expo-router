package expo.modules.backgroundrunner

import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments

class BackgroundRunnerTaskService : HeadlessJsTaskService() {

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      val options = intent?.getSerializableMap("options") ?: hashMapOf()
      val params = options["parameters"] as? Map<String, Any> ?: emptyMap()

      Log.d("BGTaskService", "onStartCommand params: $params")
      BackgroundEventEmitter.fireExecuteEvent(
        mapOf("parameters" to params)
      )

    } catch (e: Exception) {
      Log.e("BGTaskService", "Failed to emit event: ${e.message}")
    }

    return super.onStartCommand(intent, flags, startId)
  }

  override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
    val options = intent?.getSerializableMap("options") ?: hashMapOf()
    val params = options["parameters"] as? Map<String, Any> ?: emptyMap()
    Log.d("BGTaskService", "getTaskConfig params: $params")

    val jsParams = Arguments.makeNativeMap(
      mapOf("parameters" to params)
    )

    return HeadlessJsTaskConfig(
      "BackgroundRunnerTask",
      jsParams,
      60000,
      true
    )
  }
}
