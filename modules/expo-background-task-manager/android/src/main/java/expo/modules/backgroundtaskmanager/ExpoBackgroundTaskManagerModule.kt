package expo.modules.backgroundtaskmanager

import android.content.Intent
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoBackgroundTaskManagerModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("ExpoBackgroundTaskManager")

    // START SERVICE
    AsyncFunction("start") { options: Map<String, Any> ->
      val ctx = appContext.reactContext ?: throw Exception("No context")

      val intent = Intent(ctx, BackgroundForegroundService::class.java).apply {
        putExtra("title", options["title"] as? String ?: "Running")
        putExtra("message", options["message"] as? String ?: "Background task running")
        putExtra("interval", (options["interval"] as? Double ?: 2000.0).toLong())
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        ctx.startForegroundService(intent)
      } else {
        ctx.startService(intent)
      }
      true
    }

    // STOP SERVICE
    AsyncFunction("stop") {
      val ctx = appContext.reactContext ?: throw Exception("No context")
      val intent = Intent(ctx, BackgroundForegroundService::class.java)
      ctx.stopService(intent)
      true
    }

    // UPDATE NOTIFICATION
    AsyncFunction("updateNotification") { options: Map<String, Any> ->
      val ctx = appContext.reactContext ?: throw Exception("No context")

      BackgroundForegroundService.updateNotificationFromJS(
        ctx,
        options["title"] as? String ?: "Updated Title",
        options["message"] as? String ?: "Updated Message"
      )
      true
    }
  }
}
