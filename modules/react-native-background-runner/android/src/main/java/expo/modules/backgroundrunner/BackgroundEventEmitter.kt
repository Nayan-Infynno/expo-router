package expo.modules.backgroundrunner

import android.util.Log
import expo.modules.kotlin.modules.Module

object BackgroundEventEmitter {

    // Module reference (set via setModule)
    @Volatile
    private var moduleRef: Module? = null

    private val pendingEvents: MutableList<Map<String, Any?>> = mutableListOf()

    /**
     * Called by the native module when it's created/attached to JS.
     * This will set module reference and flush any queued events.
     */
    @Synchronized
    fun setModule(m: Module?) {
        try {
            moduleRef = m
            Log.d("BGEmitter", "Module set: $m | pending=${pendingEvents.size}")
            // Flush queued events immediately
            if (m != null && pendingEvents.isNotEmpty()) {
                val copy = pendingEvents.toList()
                pendingEvents.clear()
                for (ev in copy) {
                    try {
                        m.sendEvent("onExecute", ev)
                        Log.d("BGEmitter", "Flushed pending onExecute: $ev")
                    } catch (ex: Exception) {
                        Log.e("BGEmitter", "Flush send failed: ${ex.message}")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("BGEmitter", "setModule error: ${e.message}")
        }
    }

    fun fireExecuteEvent(data: Map<String, Any?>) {
        try {
            val m = moduleRef
            Log.d("BGEmitter", "fireExecuteEvent moduleRef: $m")
            if (m != null) {
                m.sendEvent("onExecute", data)
                Log.d("BGEmitter", "Sent onExecute to JS: $data")
            } else {
                // queue for later -- will be flushed in setModule()
                pendingEvents.add(data)
                Log.d("BGEmitter", "Queued onExecute (JS not ready): $data")
            }
        } catch (e: Exception) {
            Log.e("BGEmitter", "Failed to emit event: ${e.message}")
        }
    }

    // Useful for tests/debugging
    @Synchronized
    fun clearPending() {
        pendingEvents.clear()
    }
}
