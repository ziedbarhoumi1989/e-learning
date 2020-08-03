import { Component, OnInit, TemplateRef } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {FormGroup, FormControl, FormBuilder,Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  regError = false;
	email: String;
	password: String;
  flipDiv = false;
  modalRef: BsModalRef;
  config = {
      animated: true,
      keyboard: true,
      class: "my-modal"
    };

  value: String;
  first: String;
  last: String;
  regEmail: String;
  regRole: String;
  regPassword: String;
  regUniversity: String;
  regForm: FormGroup;

  switch={
    first_: false,
    last_: false,
    email_: false,
    password_: false,
    university_: false
  };

  constructor(
  	private authService: AuthService,
  	private router: Router,
  	private flashMessage: FlashMessagesService,
    private modalService: BsModalService,
    private validateService: ValidateService, 
    private _formBuilder: FormBuilder
  	) { }

  ngOnInit() {
    //this.authService.logOut();

    this.regForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      lastCtrl: ['', Validators.required],
      emailCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required],
      universityCtrl: ['', Validators.required]
    });
  }

  flipDivFunc() {
    this.flipDiv = !this.flipDiv;
  }

  onLoginSubmit(){

   if(this.email == null || this.password == null){
     this.email = null;
     this.password = null;
     this.flashMessage.show("Something went wrong, empty email or password", {cssClass: 'alert-danger', timeout: 5000});
      this.router.navigate(['login']);
  }
  else if(this.email != null && this.password !=null){
    const user = {
      email: this.email,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data =>{
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show("Logged in!", {cssClass: 'alert-success', timeout: 5000});
        this.router.navigateByUrl('/dashboard');
      }else{
        this.email = null;
         this.password = null;
        this.flashMessage.show("Something went wrong, are you sure those credentials are correct?", {cssClass: 'alert-danger', timeout: 5000});
        this.regError = true;
        this.router.navigate(['login']);
      }
    });
   
  }
   
  }

  openModal(template: TemplateRef<any>) {
    this.regEmail = null;
    this.regPassword = null;
    this.regRole = null;
    this.regUniversity = null;
    this.first = null;
    this.last = null;
    this.modalRef = this.modalService.show(template, this.config);
  }
  onRegisterSubmit(){
  console.log(this.value);
  //this.modalRef.hide();

  const user={
    first: this.first,
    last: this.last,
    email: this.regEmail,
    password: this.regPassword,
    university: this.regUniversity


  }
  //Required Fields
  if(!this.validateService.validateRegister(user)){
    //this.flashMessage.show("Fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
      this.regError = true;
  }
  else{
    this.regError = false;
    this.modalRef.hide();
  }

  //Register User
  if(this.value == 'student'){
  this.authService.registerUser(user).subscribe(
        suc => {
            this.flashMessage.show("Registration Successful", {cssClass: 'alert-success', timeout: 3000});
        },
        err => {
            this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
            //this.router.navigate(['/register']);
            this.regError = true;
            console.log(err );
        }
    );
}
else if(this.value == 'teacher'){
  this.authService.registerTeacher(user).subscribe(
        suc => {
            this.flashMessage.show("Registration Successful", {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/login']);
        },
        err => {
            this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
            this.router.navigate(['/register']);
            console.log(err );
        }
    );
}

}
onSelectionChange(event){
    this.value = event.value;
  }

  empty(event){
    console.log(event);
  }

 isNull(field){
   if(field == null || field == ""){
     return true;
   }
   else{
     return false;
   }
 }
 onClick(){
    this.regError = false;
  }

}