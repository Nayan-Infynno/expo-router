package expo.modules.backgroundrunner

import android.util.Log
import expo.modules.kotlin.modules.Module

object BackgroundEventEmitter {

    var module: Module? = null

    private val pendingEvents: MutableList<Map<String, Any?>> = mutableListOf()

    fun fireExecuteEvent(data: Map<String, Any?>) {
        try {
            val m = module
            if (m != null) {
                m.sendEvent("onExecute", data)
                Log.d("BGEmitter", "Sent onExecute to JS: $data")
            } else {
                pendingEvents.add(data)
                Log.d("BGEmitter", "Queued onExecute (JS not ready): $data")
            }
        } catch (e: Exception) {
            Log.e("BGEmitter", "Failed to emit event: ${e.message}")
        }
    }

    fun flushPendingEvents() {
        try {
            val m = module ?: return
            if (pendingEvents.isEmpty()) return
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
        } catch (e: Exception) {
            Log.e("BGEmitter", "flushPendingEvents error: ${e.message}")
        }
    }
}
