import { Component } from '@angular/core';
import {NavController, NavParams, /*Config, */Events } from 'ionic-angular';
import { RecordService } from '../../providers/record-service';
import { TranslateService } from '@ngx-translate/core';

// pages
import { RecordDetailsPage } from '../record-details/record-details';
import { GoogleMapsPage } from '../google-maps/google-maps';
import { SearchPage } from '../search/search';

// context
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-records-list',
  templateUrl: 'records-list.html',
  providers: [RecordService]
})
export class RecordsListPage {

  private dataset: any;
  private domain: String;
  private records: any = [];
  private currentPage: number = 0;
  private pageSize: number = 10;
  private showMapWithInToolbar : false;

  private direction : String = "desc";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public recordService: RecordService, 
    public events: Events,
    translate: TranslateService) {

    // ########### begin translations ###########
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(MyApp.appConfig.defaultLanguage);
    translate.use(MyApp.appConfig.defaultLanguage)
    // ########### end translations ###########

    this.dataset = navParams.get('dataset');

    if (this.dataset._slug === 'recycling-glossary') this.direction = "asc";

    this.domain = MyApp.appConfig.domain;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RecordsListPage');

    this.events.subscribe('show-map-within-toolbar', (showMapWithInToolbar) => {
      console.log('ionViewDidLoad.subscribe: showMapWithInToolbar: ', showMapWithInToolbar);

      this.showMapWithInToolbar = showMapWithInToolbar;
    });

    if(this.dataset) this.loadRecords(this.dataset.id, null);
  }

  // Runs when the page is about to be destroyed and have its elements removed.
  ionViewWillUnload() {
    this.events.unsubscribe('show-map-within-toolbar');

    console.log('ionViewWillUnload.unsubscribe');
  } 

  loadRecords(datasetId, refresher) {
    this.recordService.load(datasetId, 0, 20, this.direction)
      .then(data => {
        this.records = data;

        if (refresher !== undefined && refresher !== null) {
          refresher.complete();
        }

        // console.log(this.records);
      });
  }

  onRecordClicked(record) {
    // console.log(record.id + " selected");

    var title = record.id;


    this.navCtrl.push(RecordDetailsPage,
      { record: record, title: title}
    );
  }

  private onToolbarMapClick() {
    // console.log("record-list.onToolbarMapClick");
    
    this.navCtrl.push(GoogleMapsPage,
      { dataset: this.dataset }
    );
  }

  private onToolbarSearchClick() {
    this.navCtrl.push(SearchPage,
      { 
        criteria: "record",
        datasetId: this.dataset.id
      }
    );
  }

  doInfinite(infiniteScroll) {
    // console.log('Begin async operation');
    this.currentPage++;
    this.recordService.load(this.dataset.id, this.currentPage, this.pageSize, this.direction)
      .then(data => {
        /* this.records = data;*/
        let dataAsArray: any = data;
        for (let record of dataAsArray) {
          this.records.push(record);
        }

        // resolve(true);

        infiniteScroll.complete();
      });
  }

  doRefresh(refresher) {
    this.loadRecords(this.dataset.id, refresher);
  }

}
