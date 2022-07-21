import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, Subject } from 'rxjs';
import { APIEndPoints as ep} from 'src/app/core/app.config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private subject = new Subject<any>();

  constructor(public http: HttpClient) { }

  private geturl(_key: string, _id: string = ""): string {
    const keyName = _key as keyof typeof ep;
    let url: string = "";
    if (_id.trim() !== "") url = `${ep[keyName]}/${_id}`
    else url = `${ep[keyName]}`
    return url
  }

  public get(_key: string, _id: string = ""): Observable<any> {
    let url: string = this.geturl(_key, _id);
    return this.http.get(url);
  }

  public post(_key: string, _payload: any): Observable<any> {
    let url: string = this.geturl(_key);
    return this.http.post(url, _payload);
  }

  public put(_key: string, _payload: any, _id: string): Observable<any> {
    let url: string = this.geturl(_key, _id);
    return this.http.put(url, _payload);
  }

  sendMessage(message: any) { this.subject.next({ text: message });}

  clearMessages() { this.subject.next({});}

  onMessage(): Observable<any> { return this.subject.asObservable();}
}
