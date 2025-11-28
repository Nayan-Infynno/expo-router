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

  // Required to keep builder between updates
  private var builder: NotificationCompat.Builder? = null

  // ---------------------------------------------
  //   CREATE FOREGROUND NOTIFICATION
  // ---------------------------------------------
  fun startForegroundNotification(service: Service, options: Map<String, Any>) {
    createNotificationChannel(service)

    val title = options["taskTitle"] as? String ?: "Background Service"
    val desc = options["taskDesc"] as? String ?: "Service is running"
    val colorStr = options["color"] as? String
    val iconMap = options["taskIcon"] as? Map<*, *>
    val linkingURI = options["linkingURI"] as? String

    // --------------------- INTENT FOR TAP ACTION ---------------------
    val tapIntent = if (linkingURI != null) {
      Intent(Intent.ACTION_VIEW).apply {
        data = android.net.Uri.parse(linkingURI)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
    } else {
      Intent(service, javaClass) // fallback
    }

    val pendingIntent = PendingIntent.getActivity(
      service,
      0,
      tapIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    // --------------------- ICON SETUP ---------------------
    val iconRes = resolveIcon(service, iconMap)

    // --------------------- BUILD NOTIFICATION ---------------------
    builder = NotificationCompat.Builder(service, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(desc)
      .setSmallIcon(iconRes)
      .setContentIntent(pendingIntent)
      .setOngoing(true)
      .setPriority(NotificationCompat.PRIORITY_MAX)

    if (colorStr != null) {
      try {
        builder?.color = Color.parseColor(colorStr)
      } catch (_: Exception) {}
    }

    val notification = builder!!.build()

    service.startForeground(NOTIFICATION_ID, notification)
  }

  // ---------------------------------------------
  //   UPDATE EXISTING NOTIFICATION
  // ---------------------------------------------
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

    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.notify(NOTIFICATION_ID, builder!!.build())
  }

  // ---------------------------------------------
  //   STOP FOREGROUND NOTIFICATION
  // ---------------------------------------------
  fun stopForegroundNotification(service: Service) {
    try {
      service.stopForeground(true)

      val manager = service.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.cancel(NOTIFICATION_ID)
    } catch (_: Exception) {}

    builder = null
  }

  // ---------------------------------------------
  //   ICON RESOLVER
  // ---------------------------------------------
  private fun resolveIcon(context: Context, iconMap: Map<*, *>?): Int {
    if (iconMap == null) return android.R.drawable.ic_popup_sync

    val name = iconMap["name"] as? String ?: return android.R.drawable.ic_popup_sync
    val type = iconMap["type"] as? String ?: "mipmap"

    val resId = context.resources.getIdentifier(
      name,
      type,
      context.packageName
    )

    return if (resId != 0) resId else android.R.drawable.ic_popup_sync
  }

  // ---------------------------------------------
  //   CREATE CHANNEL (ANDROID 8+)
  // ---------------------------------------------
  private fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "Background Runner",
        NotificationManager.IMPORTANCE_HIGH
      )
      val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.createNotificationChannel(channel)
    }
  }
}
