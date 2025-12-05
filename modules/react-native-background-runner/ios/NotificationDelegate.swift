//import Foundation
//import UserNotifications
//
//class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {
//  static let shared = NotificationDelegate()
//
//  func userNotificationCenter(
//    _ center: UNUserNotificationCenter,
//    willPresent notification: UNNotification,
//    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
//  ) {
//    completionHandler([.banner, .list, .sound])
//  }
//}
//


import Foundation
import UserNotifications

class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationDelegate()
    
    // Foreground notification
    func userNotificationCenter(
      _ center: UNUserNotificationCenter,
      willPresent notification: UNNotification,
      withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
      let data = buildPayload(notification)
      BackgroundRunnerEventEmitter.shared.send(data)

      completionHandler([.banner, .sound, .badge])
    }
    
    // Background / Kill mode → when user taps notification
    func userNotificationCenter(
      _ center: UNUserNotificationCenter,
      didReceive response: UNNotificationResponse,
      withCompletionHandler completionHandler: @escaping () -> Void
    ) {
      let data = buildPayload(response.notification)
      BackgroundRunnerEventEmitter.shared.send(data)

      completionHandler()
    }
    
    private func buildPayload(_ notification: UNNotification) -> [String: Any] {
      let content = notification.request.content

      var payload: [String: Any] = [
        "title": content.title,
        "body": content.body
      ]
        
      // Convert userInfo keys -> String
      for (key, value) in content.userInfo {
          if let keyString = key as? String {
              payload[keyString] = value
          }
      }

      return payload
    }
}
