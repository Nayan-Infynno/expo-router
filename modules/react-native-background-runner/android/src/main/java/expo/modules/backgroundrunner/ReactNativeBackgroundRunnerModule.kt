package expo.modules.backgroundrunner

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.Calendar
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

class ReactNativeBackgroundRunnerModule : Module() {

  private var isServiceRunning: Boolean = false

  override fun definition() = ModuleDefinition {
    Name("ReactNativeBackgroundRunner")
    Events("onExecute")

    // When module attaches to JS runtime, set emitter module and flush queued events
    OnCreate {
      BackgroundEventEmitter.module = this@ReactNativeBackgroundRunnerModule
      BackgroundEventEmitter.flushPendingEvents()
    }

    // START SERVICE WITH AUTO PERMISSIONS + SAFE ORDER
    AsyncFunction("startNative") { options: Map<String, Any> ->
      val context = appContext.reactContext
        ?: throw Exception("React context not available")

      BackgroundStorage.lastOptions = options

      val intent = Intent(context, BackgroundRunnerService::class.java)
      intent.putExtra("options", HashMap(options))

      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          ContextCompat.startForegroundService(context, intent)
        } else {
          context.startService(intent)
        }

        isServiceRunning = true
        true

      } catch (e: Exception) {
        Log.e("BGRunner", "startNative failed: ${e.message}")
        throw e
      }
    }

    // STOP SERVICE
    AsyncFunction("stop") {
      val ctx = appContext.reactContext ?: return@AsyncFunction false
      BackgroundStorage.lastOptions = null
      ctx.stopService(Intent(ctx, BackgroundRunnerService::class.java))
      isServiceRunning = false
      true
    }
    
    // schedule daily
    AsyncFunction("scheduleDaily") { hour: Int, minute: Int, options: Map<String, Any> ->
      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
      val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
      val intent = Intent(ctx, BackgroundAlarmReceiver::class.java)
      intent.putExtra("options", HashMap(options))
      intent.putExtra("hour", hour)
      intent.putExtra("minute", minute)

      val pi = PendingIntent.getBroadcast(
        ctx, 9999, intent,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      )

      val cal = Calendar.getInstance().apply {
        timeInMillis = System.currentTimeMillis()
        set(Calendar.HOUR_OF_DAY, hour)
        set(Calendar.MINUTE, minute)
        set(Calendar.SECOND, 0)
        if (timeInMillis <= System.currentTimeMillis()) {
          add(Calendar.DAY_OF_MONTH, 1)
        }
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pi)
      } else {
        alarmManager.setExact(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pi)
      }
    }

    // update notification
    AsyncFunction("updateNotification") { options: Map<String, Any> ->
      BackgroundNotificationController.updateNotification(appContext.reactContext!!, options)
    }

    // battery helpers
    Function("isBatteryOptIgnored") {
      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
      BatteryOptimizationHelper.isIgnoringBatteryOptimizations(ctx)
    }

    AsyncFunction("requestIgnoreBatteryOptimizations") {
      val activity = appContext.currentActivity
      if (activity != null) {
        BatteryOptimizationHelper.requestIgnoreBatteryOptimizations(activity)
        true
      } else {
        try {
          BatteryOptimizationHelper.openAutoStartSettings(appContext.reactContext!!)
        } catch (_: Exception) {}
        false
      }
    }

    Function("openAutoStartSettings") {
      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
      BatteryOptimizationHelper.openAutoStartSettings(ctx)
    }

    Function("isRunning") {
      isServiceRunning
    }
  }

  private fun startServiceSafe(context: Context, intent: Intent) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        ContextCompat.startForegroundService(context, intent)
      } else {
        context.startService(intent)
      }
      isServiceRunning = true
    } catch (e: Exception) {
      Log.e("BGRunner", "Service start failed: ${e.message}")
      throw e
    }
  }
}
