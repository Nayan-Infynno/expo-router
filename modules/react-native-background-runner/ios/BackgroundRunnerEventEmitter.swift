import Foundation
import ExpoModulesCore

class BackgroundRunnerEventEmitter {
    static let shared = BackgroundRunnerEventEmitter()
    private var module: Module? = nil
    private var pendingEvents: [[String: Any]] = []
    
    func setModule(_ module: Module) {
      self.module = module
      flush()
    }
    
    func send(_ data: [String: Any]) {
      guard let module = module else {
        pendingEvents.append(data)
        return
      }

      module.sendEvent("onNotificationReceivedIOS", data)
    }

    private func flush() {
      guard let module = module else { return }
      for e in pendingEvents {
        module.sendEvent("onNotificationReceivedIOS", e)
      }
      pendingEvents.removeAll()
    }
}

