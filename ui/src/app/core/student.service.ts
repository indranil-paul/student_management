import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { APIEndPoints as ep} from 'src/app/core/app.config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(public http: HttpClient) { }

  public geturl(_key: string, id: string = "") {
    return `ep.${_key}/${id}`
  }

  public fetch(_url: string): Observable<any> {
    return this.http.get(_url);
  }
}
