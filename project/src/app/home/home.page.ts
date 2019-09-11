import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { NavController, NavParams } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Meal } from '../classes/Meal';
import { CalendarService } from '../Providers/calendar.service';
import {DayMeal} from '../classes/DayMeal';
import { LabelsService } from '../Providers/labels.service';
import {AutoCompleteLabelsService} from '../Providers/auto-complete-labels.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  // @ViewChild(CalendarComponent) myCal: CalendarComponent;
  event: DayMeal;
  minDate = new Date().toISOString();
  
  // all meals returned from server
  eventSource = new Array<DayMeal>();
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  flag = 0;
  searchText=""
  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private router: Router,
    public autoCompleteLabelsService: AutoCompleteLabelsService, private calendarS: CalendarService ) {
    // this.loadLabelsFromAPI();
  }

  ngOnInit() {
    

      // this.resetEvent();
      // const eventCopy = {
      //   title: 'this.event.title',
      //   startTime:  new Date().toISOString(),
      //   endTime: new Date().toISOString(),
      //   path: 'this.event.path',
      //   desc: 'this.event.desc'
      // };
      // send eventCopy to api
      // this.eventSource.push(eventCopy);
  }

  resolveAfter2Seconds(date: Date) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          // send the local storage base64 path
          this.calendarS.LoadFoodsFromServerForDay(date).then(data => {
            console.log(data);
            this.eventSource = [];
            this.eventSource = data as Array<DayMeal>;
          })
        );
      }, 400);
    });
  }
  /**
   * asynchronous func to load labels from webapi
   * marks as true only 5, all the rest are marked as false
   * called on page load
   */
  async loadLabelsFromAPI(date: Date) {
    await this.resolveAfter2Seconds(date);

  }



 

  resetEvent() {
    this.event = {
      path: '',
      hourS: new Date().toISOString(),
      hourE: new Date().toISOString(),
      categories: []
    };
  }

  // Create the right event format and reload source
  // addEvent(); {
  //   const eventCopy = {
  //     title: this.event.title,
  //     startTime:  new Date(this.event.startTime),
  //     endTime: new Date(this.event.endTime),
  //     allDay: this.event.allDay,
  //     desc: this.event.desc
  //   };

  //   if (eventCopy.allDay) {
  //     const start = eventCopy.startTime;
  //     const end = eventCopy.endTime;

  //     eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  //     eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
  //   }
  // // send eventCopy to api????????????????? opens the take picture page.... or something else?????

  //   // this.eventSource.push(eventCopy);
  //   // this.myCal.loadEvents();
  //   this.resetEvent();
  // }
  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode.detail.value;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.hourS, 'medium', this.locale);
    const end = formatDate(event.hourE, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
  }


  onSelected() {
    // console.log(event.currentTarget);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.searchText)
        // special: JSON.stringify(event.currentTarget.attributes[3].textContent)
      }
    };
    this.searchText = '';
    this.router.navigate(['search'], navigationExtras);
  }

  // Time slot was clicked
  onTimeSelected(event) {
    // const selected = new Date(event.selectedTime);
    // this.event.hourS = selected.toISOString();
    // selected.setHours(selected.getHours() + 1);
    // this.event.hourE = (selected.toISOString());
    // this.loadLabelsFromAPI(selected);

    // send event....
    //
  }
}
