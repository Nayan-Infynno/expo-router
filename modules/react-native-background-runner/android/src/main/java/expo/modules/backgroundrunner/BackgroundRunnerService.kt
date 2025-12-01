package expo.modules.backgroundrunner

import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log

class BackgroundRunnerService : Service() {

  private var currentOptions: Map<String, Any>? = null

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      val optionsMap = intent?.getSerializableMap("options") ?: hashMapOf()
      currentOptions = optionsMap

      BackgroundNotificationController.startForegroundNotification(this, optionsMap)

      notifyJSCallback()

    } catch (e: Exception) {
      Log.e("BGService", "Service start failed: ${e.message}")
    }

    return START_STICKY
  }

  private fun notifyJSCallback() {
    try {
      val module = BackgroundEventEmitter.module ?: return

      val params = currentOptions?.get("parameters") as? Map<String, Any> ?: emptyMap()

      BackgroundEventEmitter.fireExecuteEvent(
        mapOf("parameters" to params)
      )
    } catch (e: Exception) {
      Log.e("BGService", "Event emit failed: ${e.message}")
    }
  }

  override fun onDestroy() {
    try {
      BackgroundNotificationController.stopForegroundNotification(this)
    } catch (_: Exception) {}

    super.onDestroy()
  }
}

@Suppress("DEPRECATION")
fun Intent.getSerializableMap(key: String): HashMap<String, Any>? {
  return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    this.getSerializableExtra(key, HashMap::class.java) as? HashMap<String, Any>
  } else {
    this.getSerializableExtra(key) as? HashMap<String, Any>
  }
}
