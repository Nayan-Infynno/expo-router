import ExpoModulesCore
import Foundation
import BackgroundTasks
import UIKit

public class ExpoBackgroundTaskManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoBackgroundTaskManager")

    AsyncFunction("start") { (options: [String: Any]) -> Bool in
      print("🚫 iOS: Foreground Service is not supported. Ignoring start().")
      return false
    }

    // Same as Android: stop()
    AsyncFunction("stop") { () -> Bool in
      print("🚫 iOS: stop() called. Nothing to stop on iOS.")
      return false
    }

    // Same as Android: updateNotification(options)
    AsyncFunction("updateNotification") { (options: [String: Any]) -> Bool in
      print("🚫 iOS: Notifications for background service not supported.")
      return false
    }

  }
}
