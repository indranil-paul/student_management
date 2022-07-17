import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppAlertService{
    private subject = new Subject<any>();
    private dispTime: number = 4000;

    constructor() {}

    public appAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    public clear() {
        this.subject.next({});
    }

    public info(_msg: string){
        setTimeout(() => {
            this.clear();
        }, this.dispTime);
        this.subject.next({type: 'info', text: _msg})
    }

    public warning(_msg: string){
        setTimeout(() => {
            this.clear();
        }, this.dispTime);
        this.subject.next({type: 'warning', text: _msg})
    }

    public error(_msg: string){
        setTimeout(() => {
            this.clear();
        }, this.dispTime);
        this.subject.next({type: 'error', text: _msg})
    }

    public success(_msg: string){
        setTimeout(() => {
            this.clear();
        }, this.dispTime);
        this.subject.next({type: 'success', text: _msg})
    }
}