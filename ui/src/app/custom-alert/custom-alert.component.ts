import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppAlertService } from '../core/app-alert.service';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent implements OnInit {
  private subscription!: Subscription;
  public message: any;

  constructor(private alertService: AppAlertService) { }

  ngOnInit(): void {
    this.subscription = this.alertService.appAlert().subscribe((msg: any)=>{
      switch (msg.type) {
        case 'success':
          msg.cssClass = 'alert alert-success'; break;
        case 'error':
          msg.cssClass = 'alert alert-danger'; break;
        case 'warning':
          msg.cssClass = 'alert alert-warning'; break;
        case 'info':
          msg.cssClass = 'alert alert-info'; break;
      }
      this.message = msg;
    });
  } 

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
