import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject} from '@angular/core';
import {ClassService} from '../../services/class.service';
import {AuthService} from '../../services/auth.service';
import {TaskService} from '../../services/task.service';
import {ActivityService} from '../../services/activity.service';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer,SafeHtml,SafeUrl,SafeStyle} from '@angular/platform-browser';
import {FormGroup, FormControl} from '@angular/forms';
import { DOCUMENT } from '@angular/common'; 
import 'rxjs/Rx'; 
import {MatDialog, MAT_DIALOG_DATA, MatSidenav, MatDialogRef} from '@angular/material';
declare var angular: any;
declare var anno: any;

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit{
originalName: string;
email: string;
activityname: string;
module: any;
editorConfig: any;
flipDiv = false;
user: any;
checked: boolean = false;
teacher: boolean=false;
filename: any;
activity: any;
public tasks = [];
userComments = [];
path: any;
statusStr: any;
userStatusStr: any;
dividerHTML: any;
url: any;
answer: Boolean=false;
htmlContent: any;
index: any;
answerStr: string;
answerArray = [];
dynamicURL : string;
dynamicContent: string;
dynamicStudentSubmission: string;
images = [];
testEmails = ["email1"];
alreadySubmitted: boolean = false;
taskCompletedCount: number;
public submissionArray = [];
public classSubmissionArray = [];
form=new FormGroup({email: new FormControl()});
@ViewChild(ActivityComponent) public pollComponent: ActivityComponent;


  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) document, 
    private activityService: ActivityService, 
    private sanitize: DomSanitizer, 
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService, 
    private classService: ClassService) { }

  ngOnInit() {
    this.answer=null;
    this.editorConfig={
    "editable": true,
    "spellcheck": true,
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "imageEndPoint": "",
    "toolbar": [
        ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
        ["fontName", "fontSize", "color"],
        ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"]]
}
    //anno.makeAnnotatable(test);

   
    this.activityname = this.route.snapshot.paramMap.get('activityname');

  	if(this.authService.isTeacher()){
      this.teacher=true;
    }
    this.activityService.getActivityByTitle(this.activityname).subscribe(data=>{
      this.activity = data;
      this.module = data.module_code;
      console.log(data);
      this.tasks= this.activity.tasks;
      this.classSubmissionArray = data.submissions;
      console.log(this.classSubmissionArray);
      console.log(this.activity);
    },
    err=>{
      console.log(err);
    }); 
    this.taskService.getFilesByActName(this.activityname).subscribe(data=>{
      this.images = data;
      console.log(data);
    })

    this.authService.getProfile().subscribe(data=>{
      console.log(data);
    });
      // suc=>{
      //     console.log("Success!");
          
      //    this.user = suc.user;
      //    this.email = suc.user.email;
      //    for(var i = 0; i< suc.user.submissions.length; i++){
      //      if(suc.user.submissions[i].activityName == this.activityname){
      //        this.submissionArray[i] = suc.user.submissions[i];
      //      }
      //    }
      //    console.log(this.submissionArray);
          
      // },
      // err=>{
      //   console.log("Something went wrong!");
      // });
  }

checkSingleAns(index){


  if(this.tasks[index] == null){
      return false;
  }
  else if(this.tasks[index].submitted == true)
    return true;
}
checkAllAns(){
  if(this.tasks.length == this.answerArray.length){
    return true;
  }
  else{
    return false;
  }
}
tabChange(event){
  this.dynamicContent = null;
  this.dynamicStudentSubmission = null;
  // if(this.images[event.index] !=null){
  //   this.dynamicURL = this.images[event.index].originalname;
  // }
  for(var j = 0; j<this.images.length; j++){
      if(this.images[j].task_title == event.tab.textLabel){
        this.dynamicURL = this.images[j].originalname;
      }
  }
 for(var i=0; i<this.submissionArray.length; i++){
   if(this.submissionArray[i] != null){
     if(this.submissionArray[i].taskName == event.tab.textLabel){
       this.dynamicContent = this.submissionArray[i].content;
     }
   }
 }

  this.clear();
  console.log(event);
  this.index = event.index;
  console.log(this.index);
  
  if(this.answerArray.length>0){
    if(this.answerArray[event.index]!=null){
      this.htmlContent = this.answerArray[event.index].content;
      this.answer=true;
      console.log("ANSWER!!: " + this.answerArray[event.index].content);
    }
    else{
      this.answer=false;
      console.log("no answer yet");
    }

}
else{
  this.answer=false;
  console.log("nothing in here");
}
//is it an image
if(this.tasks[event.index].originalname){
      console.log("YES");
  }
  else{
    console.log("Nah");
  }

}
flipDivFunc() {
    this.flipDiv = !this.flipDiv;
  }

clear(){
  this.htmlContent = "";
}
getTextContent(index){
  if(this.submissionArray[index] != null && this.submissionArray[index].task_type == 'text'){
    return this.submissionArray[index].content;
  }
}
onAnswerSubmit(title,thisString){
 this.dynamicContent = thisString;
  this.taskCompletedCount++;
  console.log(this.index);
  this.answer=true;
  this.answerStr = thisString;

  this.statusStr={
   name:{
    first: this.user.first,
    last: this.user.last,
  },
    taskTitle: title, 
    content: thisString,
    email: this.email
  };

  this.userStatusStr={
    activityName: this.activity.activityName,
    taskName: title,
    submitted: true,
    content: thisString,
    email: this.email
  };
  console.log(this.userStatusStr);
  this.submissionArray[this.index]=this.userStatusStr;
  console.log(this.submissionArray);
  this.activityService.updateSubmissions(this.activity.activityName, this.statusStr).subscribe(
    suc=>{
      console.log("Success!");
    },
    err=>{
      console.log("Something went wrong! " + err);
    
  });
  this.activityService.updateUserSubmission(this.email, this.userStatusStr).subscribe(
    suc=>{
      console.log("Success!");
    },
    err=>{
      console.log("Something went wrong!");
    });

  console.log(title);
  console.log(this.statusStr);  
 // console.log(this.answerArray);
}

showStudentSubmission(content){
  this.dynamicStudentSubmission = content;
}

empty(){
  alert("You have not typed anything to submit!")
}
checkSubmitted(taskName){
  for(var i=0; i<this.submissionArray.length; i++){
    if(this.submissionArray[i]!=null){
      if( this.submissionArray[i].submitted == true && 
          this.submissionArray[i].taskName == taskName && 
          this.submissionArray[i].activityName == this.activityname){ 
            return true;
      }
    }
  }
  return false;  
}
openPreviewDialog(index) {
  
        let dialogRef = this.dialog.open(ImagePreviewComponent , {
        data: {
          image: this.dynamicURL
        },
        panelClass: 'custom-dialog-container'
      });
    }

}

@Component({
  selector: 'preview-dialog',
  templateUrl: 'image-preview-dialog.html',
})
export class ImagePreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
