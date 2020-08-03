import { Component, OnInit, ViewChild, TemplateRef, NgZone, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ClassService} from '../../services/class.service';
import {AuthService} from '../../services/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ActivityService} from '../../services/activity.service';
import {Location} from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA, MatSidenav, MatDialogRef} from '@angular/material';
export var module_code = module_code;

export interface DialogData {
  
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
   encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
newTitle: String;
newModule_code: String;
enrollCode: String;
flipDiv = false;
renderer = false;
email: string;
first: string;
last: string;
title: string;
role: string;
password: string;
id: string;
public classIds=[];
public classes=[];
user: any;
show: boolean = false;
teacher: boolean = false;
modalRef: BsModalRef;
config = {
    animated: true,
    keyboard: true
  };
 class: any;
studentCount: any;
students = [];
activityArray=[];

  constructor(
    private _ngZone: NgZone,
    public dialog: MatDialog, 
    private activityService: ActivityService,
    private modalService: BsModalService,
    private classService: ClassService, 
    private authService: AuthService, 
    private router: Router,
    private _location: Location) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(data =>{
      console.log(data);
      this.email = data.user.email;

      this.user = data.user;    
      this.classes = data.user.classes;
      console.log(this.classes);
      this.first = data.user.first;
      this.last = data.user.last;

      for(var i =0; i<this.classes.length; i++){
        this.activityService.getActivitiesByModule(this.classes[i].module_code)
        .subscribe(data=>{
          if(data.length == 0){
            console.log("empty");
          }
          else{
            for(var j =0; j<data.length; j++){
              this.activityArray.push(data[j]);
              console.log(this.activityArray);
            }
          }
        })
      }

      if(this.authService.isTeacher()){
        this.teacher=true;
      }
    },
    err =>{
      console.log(err);
      return false;
    });

    console.log(this.classes);

    this.classService.getStudents().subscribe(data=>{
      this.students = data;
    });
  }

  storeCode(module_code, email){
  	this.classService.storeClassData(module_code, email);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  createClass(){
    this.class = {
      title : this.newTitle,
      module_code : this.newModule_code,
      teacher: {
        email: this.email,
        first: this.user.first,
        last: this.user.last
      }
    }
    this.classService.createClass(this.class).subscribe(
      data=>{
        if(data.status == true){
          console.log(data);
          this.classes.push(this.class);
        }
        else{
          console.log(data);
        }
      }
     )}

  enroll(){
    window.location.reload();
    const user_={
      first: this.first,
      last: this.last,
      email: this.email,
      password: this.password
    }
    //console.log(this.enrollModuleCode);
    this.classService.enrollClass(this.enrollCode, user_).subscribe(
      data=>{
        if(data.status == true){
          console.log(data);
          this.classService.getClassByModule(this.enrollCode).subscribe(data=>{
            if(data.status == true){
              this.classes.push(data);
        
                  
            }
            else{
              console.log(data);
            }
          });
        }
        else{
          console.log(data);
        }
      },
      err=>{
        console.log(err);
      });
  }
  flipDivFunc() {
    if(this.flipDiv){
      this.flipDiv = false;
    }
    else{
      this.flipDiv = true;
    }
  }

  openHelpDialog(){
      let dialogRef = this.dialog.open(HelpDialogComponent,{
        width : "350px"
      });
    }
}

@Component({
  selector: 'help-dialog',
  templateUrl: 'help-dialog.html',
})
export class HelpDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HelpDialogComponent>) {}
}