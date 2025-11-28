// package expo.modules.backgroundrunner
//
// import android.content.Intent
// import android.util.Log
// import com.facebook.react.HeadlessJsTaskService
// import com.facebook.react.jstasks.HeadlessJsTaskConfig
//
// class BackgroundRunnerTaskService : HeadlessJsTaskService() {
//
//   override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
//     try {
//       // Fire JS event when headless task starts
//       val module = BackgroundEventEmitter.module
//
//       val optionsMap =
//         intent?.getSerializableExtra("options") as? HashMap<String, Any> ?: hashMapOf()
//
//       val params = optionsMap["parameters"] as? Map<String, Any> ?: emptyMap<String, Any>()
//
//       module?.fireExecuteEvent(
//         mapOf("parameters" to params)
//       )
//
//     } catch (e: Exception) {
//       Log.e("BGTaskService", "Failed to emit event: ${e.message}")
//     }
//
//     return super.onStartCommand(intent, flags, startId)
//   }
//
//   override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
//     val options = intent?.getSerializableExtra("options") as? HashMap<String, Any> ?: hashMapOf()
//     val params = options["parameters"] as? Map<String, Any> ?: emptyMap<String, Any>()
//
//     val jsParams = com.facebook.react.bridge.Arguments.makeNativeMap(
//       mapOf("parameters" to params)
//     )
//
//     return HeadlessJsTaskConfig(
//       "BackgroundRunnerTask",
//       jsParams,   // must be a WritableMap, NOT Bundle
//       60000,
//       true
//     )
//   }
// }


package expo.modules.backgroundrunner

import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments

class BackgroundRunnerTaskService : HeadlessJsTaskService() {

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      val options = intent?.getSerializableExtra("options") as? HashMap<String, Any> ?: hashMapOf()
      val params = options["parameters"] as? Map<String, Any> ?: emptyMap<String, Any>()
      BackgroundEventEmitter.fireExecuteEvent(
        mapOf("parameters" to params)
      )
    } catch (e: Exception) {
      Log.e("BGTaskService", "Failed to emit event: ${e.message}")
    }

    return super.onStartCommand(intent, flags, startId)
  }

  override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {

    val options = intent?.getSerializableExtra("options") as? HashMap<String, Any> ?: hashMapOf()
    val params = options["parameters"] as? Map<String, Any> ?: emptyMap<String, Any>()

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
