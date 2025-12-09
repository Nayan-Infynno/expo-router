package expo.modules.backgroundrunner

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object NotificationPermissionHelper {

    private const val REQUEST_CODE = 9912

    /** Check if notification permission is granted (Android 13+) */
    fun hasPermission(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true // Below Android 13 → permission not required
        }
    }

    /** Request notification permission safely */
    fun requestPermission(activity: Activity?) {
        if (activity == null) return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                REQUEST_CODE
            )
        }
    }

    /** Show permission toast one-time */
    fun showPermissionToast(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Toast.makeText(
                context,
                "Notification permission is required to run background tasks.",
                Toast.LENGTH_LONG
            ).show()
        }
    }
}
