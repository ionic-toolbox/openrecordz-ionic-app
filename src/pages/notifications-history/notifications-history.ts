import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// providers
import { NotificationHistoryProvider } from '../../providers/notification-history';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-notifications-history',
  templateUrl: 'notifications-history.html',
  providers: [NotificationHistoryProvider]
})
export class NotificationsHistoryPage {

  private notifications: any;

  // private DEFAULT_LIMIT : number = 50;  // default and max of onesignal
  // private DEFAULT_OFFSET : number = 0; // default of onesignal

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notificationHistoryProvider: NotificationHistoryProvider,
    public iab: InAppBrowser,
  ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NotificationsHistoryPage');

    // this.loadNotifications(null, this.DEFAULT_LIMIT, this.DEFAULT_OFFSET);

    this.loadNotifications(null);

  }

  // private loadNotifications(refresher, limit, offset) {
  //  this.notificationHistoryProvider.load(limit, offset)
  private loadNotifications(refresher) {
    this.notificationHistoryProvider.load()
      .then(notifications => {
        // console.log("notifications", notifications);
        this.notifications = notifications['notifications'];
        // console.log("notifications", this.notifications);

        if(refresher !== undefined && refresher !== null) refresher.complete();
        
      });
  }

  private onNotificationClick(notificationUrl) {
    if(notificationUrl) this.iab.create(notificationUrl, "_system");
  }

  private doRefresh(refresher) {
  //  this.loadNotifications(refresher, this.DEFAULT_LIMIT, this.DEFAULT_OFFSET);
    this.loadNotifications(refresher);
  }

}
