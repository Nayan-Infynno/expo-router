// package expo.modules.backgroundrunner
//
// object BackgroundEventEmitter {
//   var module: ReactNativeBackgroundRunnerModule? = null
// }


package expo.modules.backgroundrunner

import android.util.Log
import expo.modules.kotlin.modules.Module

object BackgroundEventEmitter {

    // IMPORTANT: Must be expo.modules.kotlin.modules.Module
    var module: Module? = null

    fun fireExecuteEvent(data: Map<String, Any?>) {
        try {
            // Expo sendEvent expects Map<String, Any?> or Bundle — NOT WritableMap
            module?.sendEvent(
                "onExecute",
                data // pass raw map! expo converts internally
            )
        } catch (e: Exception) {
            Log.e("BGEmitter", "Failed to emit event: ${e.message}")
        }
    }
}

