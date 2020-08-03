import { AfterViewInit, Component, OnInit, ViewChild, Renderer2, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatSidenav, MatDialogRef} from '@angular/material';
import { NavbarService } from '../../services/navbar.service';
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {ActivityService} from '../../services/activity.service';
import {Location} from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  
}

declare var jQuery: any;
declare const anno: any;

@Component({
  selector: 'app-annotation-view',
  templateUrl: './annotation-view.component.html',
  styleUrls: ['./annotation-view.component.css']
})
export class AnnotationViewComponent implements OnInit {
addingComment = false;
email: string;
hidden = true;
studentEmail: string;
taskName: string;
activityName: string;
studentString: string;
studentContext: string;
clickedIndex: string;
annoText: string;
editorConfig: any;
image: string;
url: string;
subtasks = [];
annotations = [];
submitted = false;
user: any;
dataOriginal: string;
sameUser = false;
htmlContent: string;
feedBack = [];
dynamicFeedBack = [];

@ViewChild('drawer') drawer: MatSidenav;
  constructor(
  	public dialog: MatDialog,
  	private route: ActivatedRoute,
  	public nav: NavbarService,
  	private _location: Location,
  	private router: Router, 
    private taskService:TaskService, 
    private activityService: ActivityService, 
    private authService:AuthService,
    private sanitizer: DomSanitizer
  	) { }

  ngOnInit() {
  	this.nav.hide();

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

    this.dataOriginal = "http://test";
  	this.email = this.route.snapshot.paramMap.get("email");
  	this.taskName = this.route.snapshot.paramMap.get('taskname');
    this.activityName = this.route.snapshot.paramMap.get('activityname');
    console.log(this.activityName);
    console.log(this.taskName);
    this.taskService.getTaskMultiple(this.taskName, this.activityName).subscribe(data=>{
    	console.log(data);
      this.image = data[0].originalname;
      this.url = '/api/image/'+ this.image;
      this.subtasks.push(data[0].task_desc);

      var pic = document.getElementById("image");
      anno.makeAnnotatable(pic);
      anno.hideSelectionWidget();

      anno.setProperties({
        outline: 'red'
      });
      
      this.taskService.getAnnotationsByEmail(this.email, this.activityName, this.taskName).subscribe(data=>{
      this.annotations=data;
      for(var i=0; i<this.annotations.length; i++){
      	if(this.annotations[i].feedback.length >0){
      		for(var j = 0; j< this.annotations[i].feedback.length;j++){
      			this.feedBack.push(data[i].feedback[j]);
      		}
      	}
      }
      console.log(this.feedBack);

      //this.feedBack = data.feedback;
      console.log(this.feedBack);
      console.log(this.annotations);
      if(this.annotations.length == 0){
        console.log("No submission yet!");
        this.submitted = false;
      }
      else{
        for(var i=0; i< this.annotations.length; i++){
          anno.addAnnotation(this.annotations[i]);
        }
      }

    });

      /**Get the user that is logged in currently**/
      this.authService.getProfile().subscribe(data=>{
        this.user = {
          name:{
            first: data.user.first,
            last: data.user.last
          },
          email: data.user.email,
        };
        if(this.checkSame()){
    		this.sameUser = true;
    	}
    	else{
    		this.sameUser = false;
    	}

      }
    )});


  	anno.addHandler('onAnnotationClicked',(data=>{
  	this.dynamicFeedBack = [];
     this.studentString = data.name.first + " " + data.name.last;
     this.studentContext = data.context;
     this.clickedIndex = data.index;
      this.annoText = data.text;
      for(var i = 0; i<this.feedBack.length; i++){
      	if(this.feedBack[i].index == this.clickedIndex){
      		this.dynamicFeedBack.push(this.feedBack[i])
      	}
      }
      this.toggleSideNav();
      //setTimeout(() => this.toggleSideNav(), 1000)
      console.log(this.clickedIndex);
    }));
  }

    toggleSideNav(){
    if(this.hidden){
        this.hidden = false;
        this.drawer.toggle();
    }
    else if(!this.hidden){
      this.hidden=true;
      this.drawer.toggle();
    }
  }
  backClicked() {
    this._location.back();
    //this.nav.show();
  }

  submitFeedback(text){
  	let comment = {
	  		first: this.user.name.first,
	  		last: this.user.name.last,
			index: this.clickedIndex,
  			comment: text
  			}
  this.activityService.updateFeedback(this.email, this.studentContext, comment, this.clickedIndex)
  .subscribe(data=>{
    console.log(data);
  });
  this.addingComment = false;
  text = this.clean(text);
  this.feedBack.push(comment);
  this.dynamicFeedBack.push(comment);
  console.log(this.feedBack);
  this.clear();
}

clear(){
  this.htmlContent = "";
}
empty(){
  alert("You have not typed anything to submit!")
}
close(){
	this.toggleSideNav();
}
clean(text){
	return this.sanitizer.bypassSecurityTrustHtml(text);
}
addComment(){
	this.addingComment = true;
}

checkSame(){
	if(this.email == this.user.email){
		return true;
	}
	else{
		return false;
	}
}

 openTaskDialog() {

        let dialogRef = this.dialog.open(ViewTaskDialogComponent , {
        data: {
          tasks: this.subtasks
        },
        width: "300px",
        height: "250px"
      });
    }

}
@Component({
  selector: 'annotate-dialog',
  templateUrl: 'view-task-dialog.html',
})
export class ViewTaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

