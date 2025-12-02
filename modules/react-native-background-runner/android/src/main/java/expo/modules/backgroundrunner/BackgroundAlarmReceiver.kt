package expo.modules.backgroundrunner

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import java.util.Calendar

class BackgroundAlarmReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context?, intent: Intent?) {
    if (context == null || intent == null) return

    try {
      val optionsMap = intent.getSerializableMap("options")

      val serviceIntent = Intent(context, BackgroundRunnerService::class.java)
      if (optionsMap != null) serviceIntent.putExtra("options", optionsMap)

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(serviceIntent)
      } else {
        context.startService(serviceIntent)
      }

      val hour = intent.getIntExtra("hour", -1)
      val minute = intent.getIntExtra("minute", -1)

      if (hour >= 0 && minute >= 0) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val next = Calendar.getInstance().apply {
          add(Calendar.DATE, 1)
          set(Calendar.HOUR_OF_DAY, hour)
          set(Calendar.MINUTE, minute)
          set(Calendar.SECOND, 0)
        }

        val pi = PendingIntent.getBroadcast(
          context,
          9999,
          intent,
          PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next.timeInMillis, pi)
        } else {
          am.setExact(AlarmManager.RTC_WAKEUP, next.timeInMillis, pi)
        }
      }

    } catch (e: Exception) {
      Log.e("BGAlarmReceiver", "Failed: ${e.message}")
    }
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
