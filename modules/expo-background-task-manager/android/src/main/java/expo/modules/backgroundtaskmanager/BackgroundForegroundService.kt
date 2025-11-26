package expo.modules.backgroundtaskmanager

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class BackgroundForegroundService : Service() {

  private var isRunning = true

  override fun onCreate() {
    super.onCreate()
    Log.d("FG_SERVICE", "Service Created")
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val title = intent?.getStringExtra("title") ?: "Running"
    val message = intent?.getStringExtra("message") ?: "Background Running"
    val interval = intent?.getLongExtra("interval", 2000L) ?: 2000L

    startForeground(1, buildNotification(title, message))

    // Background thread loop
    Thread {
      while (isRunning) {
        Log.d("FG_SERVICE", "Background work executing...")

        // 🔥 API call example (can be replaced with actual API logic)
        try {
          Log.d("FG_SERVICE", "Simulated API call...")
          Thread.sleep(interval)
        } catch (_: Exception) {}
      }
    }.start()

    return START_STICKY
  }

  override fun onDestroy() {
    isRunning = false
    Log.d("FG_SERVICE", "Service Destroyed")
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  // Notification Builder
  private fun buildNotification(title: String, message: String): Notification {
    val channelId = "bg_fg_service_channel"

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "Background Service",
        NotificationManager.IMPORTANCE_LOW
      )
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(channel)
    }

    return NotificationCompat.Builder(this, channelId)
      .setContentTitle(title)
      .setContentText(message)
      .setSmallIcon(android.R.drawable.ic_notification_overlay)
      .build()
  }

  companion object {
    fun updateNotificationFromJS(context: Context, title: String, message: String) {
      val channelId = "bg_fg_service_channel"
      val notification = NotificationCompat.Builder(context, channelId)
        .setContentTitle(title)
        .setContentText(message)
        .setSmallIcon(android.R.drawable.ic_notification_overlay)
        .build()

      val manager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.notify(1, notification)
    }
  }
}
