import { Component, OnInit, ComponentRef, OnDestroy} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ClassService} from '../../services/class.service';
import { NavbarService } from '../../services/navbar.service';
import {Router, NavigationEnd} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FormGroup, FormControl, FormBuilder,Validators} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

email: string;
classes = [];
classIDs = [];
user: any;
userSub: any;
isEditable = false;
updateForm : FormGroup;
first: string;
last: string;

  constructor(
  	private authService: AuthService,
    private classService: ClassService,
  	private router: Router,
  	private flashMessage: FlashMessagesService,
    public nav: NavbarService,
    private _formBuilder: FormBuilder
  	) { }

  ngOnInit() {
   this.updateForm = new FormGroup({
       first: new FormControl(),
       last : new FormControl()
    });

     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
      
    });

   if(this.authService.loggedIn()){
         this.userSub =this.authService.getProfile().subscribe(data=>{
         this.classes = data.user.classes;  
         this.user = data.user;
         this.first = data.user.first;
         this.last = data.user.last;
     })
   }

  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onLogOutClick(){
  	this.authService.logOut();
  	this.flashMessage.show("Logged Out", {cssClass: 'alert-success', timeout: 3000});
    this.ngOnInit();
  	this.router.navigate(['/login']);
  	return false;
  }

  storeCode(module_code, email){
    this.classService.storeClassData(module_code, email);
  }

  edit(){
    if(this.isEditable == false){
      this.isEditable = true;
    }
    else{
      this.isEditable = false;
      let updateObj = {
        first: this.updateForm.get('first').value,
        last: this.updateForm.get('last').value
      }
      this.authService.updateUser(this.user.email, updateObj).subscribe(data=>{
        console.log(data);
      })
      if(this.updateForm.get('first').value !=null){
        this.first = this.updateForm.get('first').value;
      }
      if(this.updateForm.get('last').value !=null){
        this.last = this.updateForm.get('last').value;
      }
    }
    
  }

}
