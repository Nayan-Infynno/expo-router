import ExpoModulesCore
import UserNotifications

public class ReactNativeBackgroundRunnerLifecycleDelegate: ExpoAppDelegateSubscriber {

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    UNUserNotificationCenter.current().delegate = NotificationDelegate.shared
    return true
  }
}
