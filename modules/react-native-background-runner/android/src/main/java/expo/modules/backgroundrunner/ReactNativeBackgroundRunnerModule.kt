package expo.modules.backgroundrunner

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Calendar

class ReactNativeBackgroundRunnerModule : Module() {

  // Add this property at top of your class
  private var isServiceRunning: Boolean = false

  override fun definition() = ModuleDefinition {

    Name("ReactNativeBackgroundRunner")

    Events("onExecute")


    // -----------------------------------------------------
    // LIFECYCLE HOOK (Correct one)
    // -----------------------------------------------------
    OnCreate {
      // Make module accessible to services
      BackgroundEventEmitter.module = this@ReactNativeBackgroundRunnerModule
    }


    // -----------------------------------------------------
    // START BACKGROUND SERVICE
    // -----------------------------------------------------
    AsyncFunction("startNative") { options: Map<String, Any> ->

      val ctx = appContext.reactContext
        ?: throw IllegalStateException("ReactContext not attached")

      val intent = Intent(ctx, BackgroundRunnerService::class.java)
      intent.putExtra("options", HashMap(options))

      try {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
          // Safe version for any context
          androidx.core.content.ContextCompat.startForegroundService(ctx, intent)
        } else {
          ctx.startService(intent)
        }

        isServiceRunning = true

      } catch (e: Exception) {
        android.util.Log.e("BGRunner", "Failed to start service: $e")
      }
    }


    // -----------------------------------------------------
    // STOP SERVICE
    // -----------------------------------------------------
    AsyncFunction("stop") {

      val ctx = appContext.reactContext
        ?: throw IllegalStateException("ReactContext not attached")

      try {
        val stopIntent = Intent(ctx, BackgroundRunnerService::class.java)
        ctx.stopService(stopIntent)
        isServiceRunning = false
      } catch (e: Exception) {
        android.util.Log.e("BGRunner", "Failed to stop service: $e")
      }
    }


    // ---------------------------
    //  DAILY SCHEDULING
    // ---------------------------
    AsyncFunction("scheduleDaily") { hour: Int, minute: Int, options: Map<String, Any> ->
      val ctx = appContext.reactContext
        ?: throw IllegalStateException("ReactContext not attached")

      val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      val intent = Intent(ctx, BackgroundAlarmReceiver::class.java)
      intent.putExtra("options", HashMap(options))

      val pi = PendingIntent.getBroadcast(
        ctx,
        9999, // unique request ID
        intent,
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

      alarmManager.setInexactRepeating(
        AlarmManager.RTC_WAKEUP,
        cal.timeInMillis,
        AlarmManager.INTERVAL_DAY,
        pi
      )
    }


    // ---------------------------
    //  UPDATE NOTIFICATION
    // ---------------------------
    AsyncFunction("updateNotification") { options: Map<String, Any> ->
      BackgroundNotificationController.updateNotification(appContext.reactContext!!, options)
    }


    // ---------------------------
    //  BATTERY OPTIMIZATION
    // ---------------------------
    Function("isBatteryOptIgnored") {
      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
      return@Function BatteryOptimizationHelper.isIgnoringBatteryOptimizations(ctx)
    }

    AsyncFunction("requestIgnoreBatteryOptimizations") {
      val current = appContext.currentActivity
      if (current != null) {
        BatteryOptimizationHelper.requestIgnoreBatteryOptimizations(current)
        return@AsyncFunction true
      } else {
        // try to open settings from app context as fallback (may require activity)
        try {
          BatteryOptimizationHelper.openAutoStartSettings(appContext.reactContext!!)
        } catch (_: Exception) {}
        return@AsyncFunction false
      }
    }

    Function("openAutoStartSettings") {
      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
      BatteryOptimizationHelper.openAutoStartSettings(ctx)
    }
    // ---------------------------


    // -----------------------------------------------------
    // CHECK RUNNING
    // -----------------------------------------------------
    Function("isRunning") {
      isServiceRunning
    }

  }
}


//class ReactNativeBackgroundRunnerModule : Module() {
//
//  private var isServiceRunning = false
//
//  override fun definition() = ModuleDefinition {
//
//    Name("ReactNativeBackgroundRunner")
//
//    Events(
//      "onExecute"   // Native → JS callback trigger
//    )
//
//    // ---------------------------
//    //  START BACKGROUND SERVICE
//    // ---------------------------
//    AsyncFunction("startNative") { options: Map<String, Any> ->
//
//      val ctx = appContext.reactContext
//        ?: throw IllegalStateException("ReactContext not attached")
//
//      val intent = Intent(ctx, BackgroundRunnerService::class.java)
//      intent.putExtra("options", HashMap(options))
//
//      try {
//        ctx.startForegroundService(intent)
//        isServiceRunning = true
//      } catch (e: Exception) {
//        Log.e("BGRunner", "Failed to start service: $e")
//      }
//    }
//
//    // ---------------------------
//    //  UPDATE NOTIFICATION
//    // ---------------------------
//    AsyncFunction("updateNotification") { options: Map<String, Any> ->
//      BackgroundNotificationController.updateNotification(appContext.reactContext!!, options)
//    }
//
//    // ---------------------------
//    //  STOP SERVICE
//    // ---------------------------
//    AsyncFunction("stop") {
//      val ctx = appContext.reactContext
//        ?: throw IllegalStateException("ReactContext not attached")
//
//      val stopIntent = Intent(ctx, BackgroundRunnerService::class.java)
//      ctx.stopService(stopIntent)
//
//      isServiceRunning = false
//    }
//
//    // ---------------------------
//    //  CHECK IF RUNNING
//    // ---------------------------
//    Function("isRunning") {
//      return@Function isServiceRunning
//    }
//
//    // ---------------------------
//    //  DAILY SCHEDULING
//    // ---------------------------
//    AsyncFunction("scheduleDaily") { hour: Int, minute: Int, options: Map<String, Any> ->
//      val ctx = appContext.reactContext
//        ?: throw IllegalStateException("ReactContext not attached")
//
//      val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
//
//      val intent = Intent(ctx, BackgroundAlarmReceiver::class.java)
//      intent.putExtra("options", HashMap(options))
//
//      val pi = PendingIntent.getBroadcast(
//        ctx,
//        9999, // unique request ID
//        intent,
//        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
//      )
//
//      val cal = Calendar.getInstance().apply {
//        timeInMillis = System.currentTimeMillis()
//        set(Calendar.HOUR_OF_DAY, hour)
//        set(Calendar.MINUTE, minute)
//        set(Calendar.SECOND, 0)
//
//        if (timeInMillis <= System.currentTimeMillis()) {
//          add(Calendar.DAY_OF_MONTH, 1)
//        }
//      }
//
//      alarmManager.setInexactRepeating(
//        AlarmManager.RTC_WAKEUP,
//        cal.timeInMillis,
//        AlarmManager.INTERVAL_DAY,
//        pi
//      )
//    }
//
//    // ---------------------------
//    //  BATTERY OPTIMIZATION
//    // ---------------------------
//    Function("isBatteryOptIgnored") {
//      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
//      return@Function BatteryOptimizationHelper.isIgnoringBatteryOptimizations(ctx)
//    }
//
//    AsyncFunction("requestIgnoreBatteryOptimizations") {
//      val current = appContext.currentActivity
//      if (current != null) {
//        BatteryOptimizationHelper.requestIgnoreBatteryOptimizations(current)
//        return@AsyncFunction true
//      } else {
//        // try to open settings from app context as fallback (may require activity)
//        try {
//          BatteryOptimizationHelper.openAutoStartSettings(appContext.reactContext!!)
//        } catch (_: Exception) {}
//        return@AsyncFunction false
//      }
//    }
//
//    Function("openAutoStartSettings") {
//      val ctx = appContext.reactContext ?: throw IllegalStateException("ReactContext not attached")
//      BatteryOptimizationHelper.openAutoStartSettings(ctx)
//    }
//
//    // ---------------------------
//
//    // This helper will be used by services to emit JS callback
//    OnActivityReady {
//      BackgroundEventEmitter.module = this@ReactNativeBackgroundRunnerModule
//    }
//  }
//
//  // Native → JS callback trigger
//  fun fireExecuteEvent(payload: Map<String, Any>) {
//    sendEvent(
//      "onExecute",
//      payload
//    )
//  }
//}