package expo.modules.backgroundrunner

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class BackgroundAlarmReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context?, intent: Intent?) {
    if (context == null || intent == null) return

    try {
      // Get the dynamic options passed during scheduleDaily()
      val optionsMap = intent.getSerializableExtra("options") as? HashMap<String, Any>

      // Prepare service intent
      val serviceIntent = Intent(context, BackgroundRunnerService::class.java)
      if (optionsMap != null) {
        serviceIntent.putExtra("options", optionsMap)
      }

      // Start foreground service (Android 8+)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(serviceIntent)
      } else {
        context.startService(serviceIntent)
      }

    } catch (e: Exception) {
      Log.e("BGAlarmReceiver", "Failed to trigger service: ${e.message}")
    }
  }
}
