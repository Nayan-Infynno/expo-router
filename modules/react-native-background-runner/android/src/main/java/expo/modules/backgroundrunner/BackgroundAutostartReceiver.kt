package expo.modules.backgroundrunner

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BackgroundAutostartReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context?, intent: Intent?) {
        if (context == null || intent == null) return

        try {
            val options = BackgroundStorage.lastOptions ?: return

            val service = Intent(context, BackgroundRunnerService::class.java)
            service.putExtra("options", HashMap(options))

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(service)
            } else {
                context.startService(service)
            }

            Log.d("AutostartReceiver", "Service restarted")
        } catch (e: Exception) {
            Log.e("AutostartReceiver", "Error: ${e.message}")
        }
    }
}
