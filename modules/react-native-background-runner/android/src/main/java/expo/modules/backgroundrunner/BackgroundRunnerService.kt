package expo.modules.backgroundrunner

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log

class BackgroundRunnerService : Service() {

  private var currentOptions: Map<String, Any>? = null

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      // Get options from JS (startNative)
      val optionsMap = intent?.getSerializableExtra("options") as? HashMap<String, Any>
      currentOptions = optionsMap

      if (optionsMap != null) {
        // start foreground notification
        BackgroundNotificationController.startForegroundNotification(
          this,
          optionsMap
        )
      }

      // Trigger JS callback (onRunningProcess)
      notifyJSCallback()

    } catch (e: Exception) {
      Log.e("BGService", "Service start failed: ${e.message}")
    }

    return START_STICKY
  }

  // ------------------------------------
  // JS CALLBACK NOTIFIER
  // ------------------------------------
  private fun notifyJSCallback() {
    try {
      val module = BackgroundEventEmitter.module ?: return

      val params = currentOptions?.get("parameters") as? Map<String, Any> ?: emptyMap()

      BackgroundEventEmitter.fireExecuteEvent(
        mapOf(
          "parameters" to params
        )
      )

    } catch (e: Exception) {
      Log.e("BGService", "Event emit failed: ${e.message}")
    }
  }

  // ------------------------------------
  // STOP SERVICE (called from JS)
  // ------------------------------------
  override fun onDestroy() {
    try {
      BackgroundNotificationController.stopForegroundNotification(this)
    } catch (_: Exception) {}

    super.onDestroy()
  }
}
