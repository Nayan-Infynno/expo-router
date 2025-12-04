import ExpoModulesCore
import UserNotifications

public class ReactNativeBackgroundRunnerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeBackgroundRunner")
      
    AsyncFunction("scheduleDailyIOS") { (hour: Int, minute: Int, options: [String: Any]) in
        return try await self.scheduleDailyNotification(hour: hour, minute: minute, options: options)
    }
  }
}

extension ReactNativeBackgroundRunnerModule {
    func scheduleDailyNotification(hour: Int, minute: Int, options: [String: Any]) async throws -> String {
        let center = UNUserNotificationCenter.current()
        
        // 1. Request permission
        let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
        if !granted {
            throw NSError(domain: "ReactNativeBackgroundRunner", code: 1, userInfo: [NSLocalizedDescriptionKey: "Notification permission denied"])
        }
        
        // 2. Clear old scheduled notifications (optional but recommended)
        center.removeAllPendingNotificationRequests()
        
        // 3. Create Notification Content
        let content = UNMutableNotificationContent()
        content.title = options["title"] as? String ?? "Daily Reminder"
        content.body = options["message"] as? String ?? "Your daily notification"
        content.sound = UNNotificationSound.default
        
        // 4. Create daily trigger (repeat everyday)
        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)

        // 5. Create request ID
        let request = UNNotificationRequest(
          identifier: "ReactNativeBackgroundRunnerDaily",
          content: content,
          trigger: trigger
        )
        
        // 6. Register notification
        try await center.add(request)
        
        return "iOS daily notification scheduled at \(hour):\(minute)"
    }
}
