import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
	filename: any;

  constructor(private http: Http) { }

  getTaskByFilename(filename){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/file='+ filename, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getTaskByTitle(title){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/title='+ title, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getTaskByModule(module){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/module='+ module, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getTaskMultiple(task, activity){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/'+ activity + '/'+ task, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  storeFileData(filename){
    localStorage.setItem("Task", JSON.stringify({ file: filename}));
    //localStorage.setItem("Email", JSON.stringify(email));
  }
  loadFile(){
  	const file = JSON.parse(localStorage.getItem("Task"));
  	return file.filename;
  }
  clearFile(){
    localStorage.removeItem("Task");
  }
  submitActivity(activity){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('activity/create', activity ,{headers: headers})
    .pipe(map(res=> res.json()));
  }

  submitAnnotation(annotation){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('annotation/create', annotation ,{headers: headers})
    .pipe(map(res=> res.json()));
  }

  getActivityByTitle(title){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('activity/'+ title, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  getFilesByActName(actName){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/activityname='+ actName, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  getFilesByModule(module){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/module='+ module, {headers: headers})
    .pipe(map(res=> res.json()));
  }

   getAnnotations(){
   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('annotations', {headers: headers})
    .pipe(map(res=> res.json()));

 }

 getAnnotationsByEmail(email, activityName, taskName){

   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('annotations/user='+ email + '/activity='+ activityName + '/task='+taskName, {headers: headers})
    .pipe(map(res=> res.json()));

 }

 deleteAnnotation(text){
   let body = {
     text: text
   }
   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('annotations/delete', {headers: headers, body: body})
    .pipe(map(res=> res.json()));
 }
 
 deleteTasksByActivity(activity){
   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('tasks/delete/'+ activity, {headers: headers})
    .pipe(map(res=> res.json()));
 }
}
