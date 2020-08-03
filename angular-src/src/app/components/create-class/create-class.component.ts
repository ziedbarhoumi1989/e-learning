import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {ClassService} from '../../services/class.service';
import {Router} from '@angular/router';
import { NgModule } from '@angular/core';
import {NgZone} from '@angular/core';
import {ValidateService} from '../../services/validate.service';

@NgModule({
   imports: [
   FlashMessagesModule.forRoot()
   ]
 })

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit {

	title;module_code;email;groups;files;first;last;university;password: String;
	isTeacher: boolean = false;

  constructor(
  	private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private classService: ClassService,
    private router: Router,
    private zone: NgZone
    ) { }

 
  ngOnInit() {
  }

onCreateSubmit(){
    var theStr = "";
		const theClass={
			title: this.title,
			module_code: this.module_code,
			teacher:{
        title: this.title,
				email: this.email
			}
		}
		if(!this.validateService.validateClass(theClass)){
    		this.flashMessage.show("Fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
    		return false;
  		}else{
  			console.log("ALL GOOD");
  		}

  		this.classService.createClass(theClass).subscribe(
        suc => {
           this.classService.storeClassData(suc.module.module_code, suc.module.email);
            //console.log(suc.module);
            this.flashMessage.show("Class Created", {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/dashboard']);
        },
        err => {
            this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
            //this.router.navigate(['/']);
            console.log(err);
        }
    );
	}
}
