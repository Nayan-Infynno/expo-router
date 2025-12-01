package expo.modules.backgroundrunner

import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.facebook.react.HeadlessJsTaskService

class BackgroundRunnerService : Service() {

    private var currentOptions: Map<String, Any>? = null
    private val CHANNEL_ID = "background_runner_channel"

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    
        try {
            val options = intent?.getSerializableMap("options") ?: hashMapOf()

            // 1. Minimal notification banate hi service ko foreground bnayo
            val notification = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(options["taskTitle"]?.toString() ?: "Running Task")
                .setContentText(options["taskDesc"]?.toString() ?: "Task started")
//                .setSmallIcon(R.drawable.ic_notification)
                .build()

            // MUST be first call
            startForeground(1, notification)

            // 2. Ab headless JS task execute karo
            val headlessIntent = Intent(applicationContext, BackgroundRunnerTaskService::class.java)
            headlessIntent.putExtra("options", HashMap(options))
            applicationContext.startService(headlessIntent)

        } catch (e: Exception) {
            Log.e("BGService", "Error starting task: ${e.message}")
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
