import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { Observable } from 'rxjs';
import {
  Http,
  Response,
  RequestOptions,
  ResponseContentType
} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { Body } from '@angular/http/src/body';
@Injectable({
  providedIn: 'root'
})
export class ApiPictureService {
  labels: Label[];
  // baseURL = 'http://localhost:54640/api/'
// baseURL = 'https://helpless-mayfly-52.localtunnel.me/api/'
  baseURL = 'http://ce6dc86e.ngrok.io/api/';
  fileToUpload: File;
  constructor(public httpClient: HttpClient) {}

  public GetLabels() {
    const res = this.httpClient.get(this.baseURL + 'clarifai/' + 'InsertImages');
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  dataURLtoFile(dataurl, filename) {
    // https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f?noredirect=1&lq=1
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  InsertImages(formData): any {
    const file = this.dataURLtoFile(formData, 'img.jpg');
    let _formData = new FormData();
    this.fileToUpload = file;
    _formData.append('file', file);
    console.log(file);
    const res = this.httpClient.post(
      this.baseURL + 'clarifai/InsertImages/',
      _formData
    );
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }
}
