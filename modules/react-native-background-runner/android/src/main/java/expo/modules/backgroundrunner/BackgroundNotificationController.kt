package expo.modules.backgroundrunner

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import androidx.core.app.NotificationCompat

object BackgroundNotificationController {

  private const val CHANNEL_ID = "background_runner_channel"
  private const val NOTIFICATION_ID = 10001

  private var builder: NotificationCompat.Builder? = null

  fun startForegroundNotification(service: Service, options: Map<String, Any>?) {
    createNotificationChannel(service)

    // Safe defaults (very important!)
    val title = options?.get("taskTitle") as? String ?: "Background Service"
    val desc = options?.get("taskDesc") as? String ?: "Running in background"
    val colorStr = options?.get("color") as? String
    val iconMap = options?.get("taskIcon") as? Map<*, *>
    val linkingURI = options?.get("linkingURI") as? String

    // Open app when tapping notification
    val tapIntent = if (!linkingURI.isNullOrEmpty()) {
      Intent(Intent.ACTION_VIEW).apply {
        data = android.net.Uri.parse(linkingURI)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
    } else {
      service.packageManager.getLaunchIntentForPackage(service.packageName)?.apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      } ?: Intent().apply {
        setClassName(service.packageName, "${service.packageName}.MainActivity")
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
    }

    val pendingIntent = PendingIntent.getActivity(
      service,
      0,
      tapIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val iconRes = resolveIcon(service, iconMap)

    builder = NotificationCompat.Builder(service, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(desc)
      .setSmallIcon(iconRes)
      .setContentIntent(pendingIntent)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setOngoing(true)
      .setAutoCancel(false)

    // Optional color
    if (colorStr != null) {
      try {
        builder?.color = Color.parseColor(colorStr)
      } catch (_: Exception) {}
    }

    val notification = builder!!.build()
    notification.flags =
      Notification.FLAG_NO_CLEAR or
      Notification.FLAG_ONGOING_EVENT or
      Notification.FLAG_FOREGROUND_SERVICE

    // FINAL: This will no longer crash on first trigger
    service.startForeground(NOTIFICATION_ID, notification)
  }

  fun updateNotification(context: Context, options: Map<String, Any>) {
    if (builder == null) return

    val title = options["taskTitle"] as? String
    val desc = options["taskDesc"] as? String
    val colorStr = options["color"] as? String
    val iconMap = options["taskIcon"] as? Map<*, *>

    if (title != null) builder?.setContentTitle(title)
    if (desc != null) builder?.setContentText(desc)

    if (colorStr != null) {
      try {
        builder?.color = Color.parseColor(colorStr)
      } catch (_: Exception) {}
    }

    if (iconMap != null) {
      val iconRes = resolveIcon(context, iconMap)
      builder?.setSmallIcon(iconRes)
    }

    val manager =
      context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.notify(NOTIFICATION_ID, builder!!.build())
  }

  fun stopForegroundNotification(service: Service) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        service.stopForeground(Service.STOP_FOREGROUND_REMOVE)
      } else {
        @Suppress("DEPRECATION")
        service.stopForeground(true)
      }
      val manager = service.getSystemService(Context.NOTIFICATION_SERVICE)
        as NotificationManager
      manager.cancel(NOTIFICATION_ID)
    } catch (_: Exception) {}

    builder = null
  }

  private fun resolveIcon(context: Context, iconMap: Map<*, *>?): Int {
    // 🔥 Guaranteed valid foreground notification icon (critical fix)
    val appIcon = context.applicationInfo.icon.takeIf { it != 0 }
      ?: android.R.drawable.ic_popup_sync

    if (iconMap == null) return appIcon

    val name = iconMap["name"] as? String ?: return appIcon
    val type = iconMap["type"] as? String ?: "mipmap"

    val resId = context.resources.getIdentifier(name, type, context.packageName)

    return if (resId != 0) resId else appIcon
  }

  private fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "Background Runner",
        NotificationManager.IMPORTANCE_HIGH
      )
      channel.lockscreenVisibility = Notification.VISIBILITY_PUBLIC

      val manager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.createNotificationChannel(channel)
    }
  }
}
