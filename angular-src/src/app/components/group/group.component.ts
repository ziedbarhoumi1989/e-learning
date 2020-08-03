import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject} from '@angular/core';
import {ClassService} from '../../services/class.service';
import {AuthService} from '../../services/auth.service';
import {ActivityService} from '../../services/activity.service';
import {TaskService} from '../../services/task.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatSidenav, MatDialogRef} from '@angular/material';

export interface DialogData {}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
currentTab = 0;
isTeacher: boolean;
addingComment = false;
flipDiv = false;
answer: Boolean=false;
activity: any;
today: number;
user: any;
add: boolean = false;
activityName: string;
htmlContent: string;
email: string;
students = [];
comments = [];
moduleCode: string;
images = [];
submissionArray = [];
commentStr: any;
editorConfig={
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
  constructor(
    public dialog: MatDialog,
    private classService:ClassService, 
    private authService:AuthService,  
    private taskService:TaskService, 
    private activityService:ActivityService, 
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    if(this.authService.isTeacher()){
      this.isTeacher = true;
    }
    else{
      this.isTeacher = false;
    }

    this.activityName = this.route.snapshot.paramMap.get('activityname');
    console.log(this.activityName);

    this.activityService.getComments(this.activityName).subscribe(data=>{
      console.log(data);
        this.comments = data;
    })

  	
  	this.authService.getProfile().subscribe(data=>{
  		this.user = data.user;
      this.email = data.user.email;
  	});

    this.activityService.getActivityByTitle(this.activityName).subscribe(data=>{
      console.log(data);
      this.activity = data;
      this.submissionArray = data.submissions;
      console.log(this.submissionArray);
      this.moduleCode = data.module_code;
      this.students = data.group;
       this.taskService.getFilesByActName(this.activityName).subscribe(data=>{
              this.images = data;
              console.log(this.images);
            });
      console.log(this.activity);
      console.log(this.students);
    });

  }

tabChange(event){
  this.currentTab = event.index;
	console.log(this.currentTab);
}
addComment(){
	this.add = true;
}
submitComment(comment){
  this.commentStr={first: this.user.first, last: this.user.last, comment: comment, time: Date.now()};
	this.comments.push(this.commentStr);
	this.htmlContent = "";
	this.add=false;
	console.log(this.comments[0]);
  this.activityService.updateComments(this.activityName, this.commentStr).subscribe(data=>{
    console.log(data);
  });
}
cancel(){
  this.add = false;
}
clear(){
  this.htmlContent="";
}
delete(key){
   this.comments.splice(key, 1);
}

checkSubmitted(taskName){
  for(var i=0; i<this.submissionArray.length; i++){
    if(this.submissionArray[i]!=null){
      if( this.submissionArray[i].email == this.email && this.submissionArray[i].taskName == taskName){

        return true;
      }
    }
  }
  return false;  
}
flipDivFunc() {
    this.flipDiv = !this.flipDiv;
  }

openPreviewDialog(index) {
  
        let dialogRef = this.dialog.open(GroupImagePreviewComponent , {

        data: {
          image: this.images[index].originalname
        },
        panelClass: 'custom-dialog-container'
      });
    }
openImageHelpDialog(){
  let dialogRef = this.dialog.open(ImageHelpDialogComponent,{
    width: "300px"
      });
}
}

@Component({
  selector: 'preview-dialog',
  templateUrl: 'group-image-preview-dialog.html',
})
export class GroupImagePreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<GroupImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
@Component({
  selector: 'preview-dialog',
  templateUrl: 'image-help-dialog.html',
})
export class ImageHelpDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}