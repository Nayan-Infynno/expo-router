// package expo.modules.backgroundrunner

// import android.app.Service
// import android.content.Intent
// import android.os.Build
// import android.os.IBinder
// import android.util.Log
// import androidx.core.app.NotificationCompat

// class BackgroundRunnerService : Service() {

//     private val CHANNEL_ID = "background_runner_channel"

//     override fun onBind(intent: Intent?): IBinder? = null

//     override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
//         try {
//             val options =
//                 intent?.getSerializableMap("options") ?: BackgroundStorage.lastOptions ?: hashMapOf()

//             BackgroundStorage.lastOptions = options

//             // Create minimal notification
//             val notification = NotificationCompat.Builder(this, CHANNEL_ID)
//                 .setContentTitle(options["taskTitle"]?.toString() ?: "Background Task")
//                 .setContentText(options["taskDesc"]?.toString() ?: "Running...")
//                 .setOngoing(true)
//                 .setSmallIcon(android.R.drawable.ic_media_play)
//                 .build()

//             startForeground(1, notification)

//             // Start Headless JS Task
//             val headlessIntent = Intent(applicationContext, BackgroundRunnerTaskService::class.java)
//             headlessIntent.putExtra("options", HashMap(options))
//             applicationContext.startService(headlessIntent)

//         } catch (e: Exception) {
//             Log.e("BGService", "Error: ${e.message}")
//         }

//         return START_STICKY
//     }

//     // ⭐ Restart if user swipes away the app
//     override fun onTaskRemoved(rootIntent: Intent?) {
//         super.onTaskRemoved(rootIntent)

//         val restartIntent = Intent("expo.backgroundrunner.RESTART")
//         sendBroadcast(restartIntent)
//     }

//     override fun onDestroy() {
//         super.onDestroy()
//         try {
//             stopForeground(STOP_FOREGROUND_REMOVE)
//         } catch (_: Exception) {}
//     }
// }


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

    private val CHANNEL_ID = "background_runner_channel"

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            val options =
                intent?.getSerializableMap("options") ?: BackgroundStorage.lastOptions ?: hashMapOf()

            BackgroundStorage.lastOptions = options

            // CREATE NOTIFICATION CHANNEL ⭐⭐ (mandatory for first time)
            createNotificationChannel()

            // Build notification
            val notification = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(options["taskTitle"]?.toString() ?: "Background Task")
                .setContentText(options["taskDesc"]?.toString() ?: "Running...")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setOngoing(true)
                .build()

            startForeground(1, notification)

            // Start Headless JS
            val headlessIntent = Intent(applicationContext, BackgroundRunnerTaskService::class.java)
            headlessIntent.putExtra("options", HashMap(options))
            applicationContext.startService(headlessIntent)

        } catch (e: Exception) {
            Log.e("BGService", "Error: ${e.message}")
        }

        return START_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Background Runner",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
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
