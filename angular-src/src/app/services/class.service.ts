import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
@Injectable({
  providedIn: 'root'
})
export class ClassService {
module_code: any;
email: any;
  constructor(private http: Http) { }

  getClasses(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('classes', {headers: headers})
    .pipe(map(res=> res.json()));
  }

 getClassByModule(module){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('class/module=' + module, {headers: headers})
    .pipe(map(res=> res.json()));
  }


  getClassById(id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('class/id=' + id, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  getTeacher(email){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('user/' + email, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  createClass(thisClass){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('class/create', thisClass, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  enrollClass(module_code, user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('class/enroll/'+module_code, user, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  storeClassData(thisModuleCode, email){
    localStorage.setItem("Module", JSON.stringify({ module_code: thisModuleCode, email: email}));
    //localStorage.setItem("Email", JSON.stringify(email));
  }

  loadModuleCode(){
    const storedModule = JSON.parse(localStorage.getItem("Module"));
    this.module_code = storedModule.module_code;
  }
  loadEmail(){
  	const storedEmail = JSON.parse(localStorage.getItem("Module"));
  	this.email = storedEmail.email;
  }

  clearClass(){
    localStorage.removeItem("Module");
  }
  getfiles(module_code){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/module='+ module_code, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getImages(file){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('files/file='+ file, {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getStudents(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/students', {headers: headers})
    .pipe(map(res=> res.json()));
  }
  getStudentsByModule(module){
      let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('classes/students/'+ module, {headers: headers})
    .pipe(map(res=> res.json()));
  }

}
