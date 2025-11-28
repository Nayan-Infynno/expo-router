package expo.modules.backgroundrunner

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.util.Log

object BatteryOptimizationHelper {

  private const val TAG = "BatteryOptHelper"

  fun isIgnoringBatteryOptimizations(context: Context): Boolean {
    return try {
      val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
      pm.isIgnoringBatteryOptimizations(context.packageName)
    } catch (e: Exception) {
      Log.w(TAG, "check opt error: ${e.message}")
      false
    }
  }

  /**
   * Opens the system dialog to request ignoring battery optimizations.
   * Must be started from an Activity context.
   */
  fun requestIgnoreBatteryOptimizations(activity: Activity) {
    try {
      val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
      intent.data = Uri.parse("package:${activity.packageName}")
      activity.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
      // fallback: open battery optimization settings page
      try {
        val fallback = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
        activity.startActivity(fallback)
      } catch (ex: Exception) {
        Log.e(TAG, "cannot open battery optimization settings: ${ex.message}")
      }
    } catch (e: Exception) {
      Log.e(TAG, "requestIgnore error: ${e.message}")
    }
  }

  /**
   * Best-effort: open OEM specific auto-start / whitelist screens.
   * Not guaranteed; some packages/activities may change across ROM versions.
   */
  fun openAutoStartSettings(context: Context) {
    val pkg = context.packageName

    // Try common OEM intents in order (wrapped individually)
    val tries = listOf(
      // Xiaomi (MIUI)
      Intent().apply {
        component = android.content.ComponentName(
          "com.miui.powerkeeper",
          "com.miui.powerkeeper.ui.HiddenAppsContainerManagementActivity"
        )
      },
      Intent().apply {
        component = android.content.ComponentName(
          "com.miui.powerkeeper",
          "com.miui.powerkeeper.ui.PowerSettingsActivity"
        )
      },
      // Huawei
      Intent().apply {
        component = android.content.ComponentName(
          "com.huawei.systemmanager",
          "com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity"
        )
      },
      // OPPO / Realme
      Intent().apply {
        component = android.content.ComponentName(
          "com.coloros.safecenter",
          "com.coloros.safecenter.startupapp.StartupAppListActivity"
        )
      },
      Intent().apply {
        component = android.content.ComponentName(
          "com.oppo.safe",
          "com.oppo.safe.permission.startup.StartupAppListActivity"
        )
      },
      // Vivo
      Intent().apply {
        component = android.content.ComponentName(
          "com.iqoo.secure",
          "com.iqoo.secure.ui.phoneoptimize.AddWhiteListActivity"
        )
      },
      // Samsung (Battery optimization settings general)
      Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS),
      // generic app details page
      Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
        data = Uri.parse("package:$pkg")
      }
    )

    for (it in tries) {
      try {
        it.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(it)
        return
      } catch (e: Exception) {
        // try next
      }
    }
  }
}
