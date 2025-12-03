package expo.modules.backgroundrunner

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class BackgroundRunnerService : Service() {

    private val CHANNEL_ID = BackgroundNotificationController.CHANNEL_ID

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            val options =
                intent?.getSerializableMap("options") ?: BackgroundStorage.lastOptions ?: hashMapOf()

            BackgroundStorage.lastOptions = options

            // Ensure channel exists (first-time)
            BackgroundNotificationController.ensureChannel(this)

            val notification = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(options["taskTitle"]?.toString() ?: "Background Task")
                .setContentText(options["taskDesc"]?.toString() ?: "Running...")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setOngoing(true)
                .build()

            startForeground(1, notification)

            // Start Headless JS Task service
            val headlessIntent = Intent(applicationContext, BackgroundRunnerTaskService::class.java)
            headlessIntent.putExtra("options", HashMap(options))
            applicationContext.startService(headlessIntent)

        } catch (e: Exception) {
            Log.e("BGService", "Error: ${e.message}")
        }

        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        val restartIntent = Intent("expo.backgroundrunner.RESTART")
        sendBroadcast(restartIntent)
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } catch (_: Exception) {}
    }
}
