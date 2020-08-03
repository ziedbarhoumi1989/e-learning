import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

	auth_token: any;
  user: any;
  thisClass: any;
  module_code:any;

  constructor(private http: Http) { 

  }

  registerUser(user){
  	let headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('users/createStud', user, {headers: headers})
  	.pipe(map(res=> res.json()));
  }
  registerTeacher(teacher){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/createTeacher', teacher, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  getUser(email){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('user/'+email, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/authenticate', user, {headers: headers})
    .pipe(map(res=> res.json()));
  }
   getProfile(){
    this.loadToken();
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.auth_token
    });
    return this.http.get('/profile',{headers:headers})
    .pipe(map(res => res.json()));
  }

  storeUserData(token, user){
    localStorage.setItem('_idtoken',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.auth_token = token;
    this.user = user;
  }

  loadEmail(){
    return JSON.parse(localStorage.getItem("user")).email;
  }

  loadToken(){
    const token = localStorage.getItem('_idtoken');
    this.auth_token = token;

  }

  isTeacher(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(user.role=="Teacher"){
      return true;
    }else if(user.role =="Student"){
      return false;
    }
  }

  loggedIn(){
    return tokenNotExpired('_idtoken');
  }

  logOut(){
    this.auth_token = null;
    this.user = null;
    this.thisClass = null;
    localStorage.clear();
  }

updateUser(email, obj){
  let body = {
      first: obj.first,
      last: obj.last
    }
    
    const headers = new Headers({
      'Content-Type':  'application/json'
    });
    return this.http.put('user/update/'+email, body, {headers: headers})
    .pipe(map(res=> res.json()));
  }
}

