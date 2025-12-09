package expo.modules.backgroundrunner

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Calendar

class ReactNativeBackgroundRunnerModule : Module() {

  private var isServiceRunning = false

  override fun definition() = ModuleDefinition {
    Name("ReactNativeBackgroundRunner")
    Events("onExecute")

    OnCreate {
      BackgroundEventEmitter.setModule(this@ReactNativeBackgroundRunnerModule)
    }

    // START SERVICE
    AsyncFunction("startNative") { options: Map<String, Any> ->
      val context = appContext.reactContext
        ?: throw IllegalStateException("ReactContext not available")

      val activity = appContext.currentActivity

      // Notification permission check
      if (!NotificationPermissionHelper.hasPermission(context)) {
        NotificationPermissionHelper.requestPermission(activity)
        NotificationPermissionHelper.showPermissionToast(context)
        return@AsyncFunction false
      }

      BackgroundStorage.save(options)

      // Ensure notification channel exists
      BackgroundNotificationController.ensureChannel(context)

      val intent = Intent(context, BackgroundRunnerService::class.java)
        .putExtra("options", HashMap(options))

      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          ContextCompat.startForegroundService(context, intent)
        } else {
          context.startService(intent)
        }
        isServiceRunning = true
        true
      } catch (e: Exception) {
        Log.e("BGRunner", "Failed to start service: ${e.message}")
        false
      }
    }

    // STOP SERVICE
    AsyncFunction("stop") {
      val ctx = appContext.reactContext ?: return@AsyncFunction false
      ctx.stopService(Intent(ctx, BackgroundRunnerService::class.java))
      BackgroundStorage.clear()
      isServiceRunning = false
      true
    }

    // SCHEDULE DAILY SERVICE
    AsyncFunction("scheduleDaily") { hour: Int, minute: Int, options: Map<String, Any> ->
      val ctx = appContext.reactContext
        ?: throw IllegalStateException("ReactContext not available")

      val activity = appContext.currentActivity

      if (!NotificationPermissionHelper.hasPermission(ctx)) {
        NotificationPermissionHelper.requestPermission(activity)
        NotificationPermissionHelper.showPermissionToast(ctx)
        return@AsyncFunction false
      }

      BackgroundNotificationController.ensureChannel(ctx)

      val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      val intent = Intent(ctx, BackgroundAlarmReceiver::class.java)
        .putExtra("options", HashMap(options))
        .putExtra("hour", hour)
        .putExtra("minute", minute)

      val pi = PendingIntent.getBroadcast(
        ctx, 9999, intent,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      )

      val calendar = Calendar.getInstance().apply {
        timeInMillis = System.currentTimeMillis()
        set(Calendar.HOUR_OF_DAY, hour)
        set(Calendar.MINUTE, minute)
        set(Calendar.SECOND, 0)
        if (timeInMillis <= System.currentTimeMillis()) {
          add(Calendar.DAY_OF_MONTH, 1)
        }
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pi)
      } else {
        alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pi)
      }

      true
    }

    // UPDATE NOTIFICATION
    AsyncFunction("updateNotification") { options: Map<String, Any> ->
      BackgroundNotificationController.updateNotification(
        appContext.reactContext!!,
        options
      )
    }

    // BATTERY OPTIMIZATION
    Function("isBatteryOptIgnored") {
      BatteryOptimizationHelper.isIgnoringBatteryOptimizations(
        appContext.reactContext!!
      )
    }

    AsyncFunction("requestIgnoreBatteryOptimizations") {
      val activity = appContext.currentActivity
      if (activity != null) {
        BatteryOptimizationHelper.requestIgnoreBatteryOptimizations(activity)
        true
      } else {
        BatteryOptimizationHelper.openAutoStartSettings(appContext.reactContext!!)
        false
      }
    }

    Function("openAutoStartSettings") {
      BatteryOptimizationHelper.openAutoStartSettings(appContext.reactContext!!)
    }

    Function("isRunning") {
      isServiceRunning
    }
  }
}
