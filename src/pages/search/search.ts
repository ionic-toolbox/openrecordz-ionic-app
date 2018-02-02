import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// context
import { MyApp } from '../../app/app.component';

// providers
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// pages
import { RecordDetailsPage } from '../record-details/record-details';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  records: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    // var term = "*";
    // this.search(term).then(records => {
    //   console.log(records);
    //   this.records = records;
    // });
  
  }

  filter(ev: any) {

    let term = ev.target.value;


    // We will only perform the search if we have 3 or more characters
    if (term && term.trim() !== '' && term.trim().length > 3) { 
      this.search(term).then(records => {
        console.log(records);
        this.records = records;
      });
    }
  }

  search(searchParam: string) {
    var url = MyApp.appConfig.urlApi + "/search?text=" + searchParam +"&crossdomainsearch=false";
    console.log('SearchPage.search: url ==  ', url);

    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(results => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // console.log(results)
          resolve(results);
        });
    });
  }

  onItemClicked(item) {
    // console.log(item.id + " item");

    // @TODO check if the result is a dataset, a binary or a record 

    var title = item.id;

    this.navCtrl.push(RecordDetailsPage,
      { record: item, title: title }
    );
  }
}