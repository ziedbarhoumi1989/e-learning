import { AfterViewInit, Component, OnInit, ViewChild, Renderer2, Inject} from '@angular/core';
import {Annotator} from 'annotator';
import { DOCUMENT } from '@angular/common'; 
import {TaskService} from '../../services/task.service';
import {AuthService} from '../../services/auth.service';
import {ActivityService} from '../../services/activity.service';
import { NavbarService } from '../../services/navbar.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, FormBuilder,Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatSidenav, MatDialogRef} from '@angular/material';
import {Location} from '@angular/common';
//var interact = require( 'interactjs/src');
declare var jQuery: any;
declare const anno: any;

export interface DialogData {
  
}


@Component({
  selector: 'app-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.css']
})


export class AnnotateComponent implements OnInit {
  showFiller = false;
  public annotations = [];
  text: any;
  taskData: any;
  context: any;
  height: any;
  width: any;
  annotation: any;
  update: boolean = false;
  url: any;
  x: any;
  y: any;
  image: any;
  email: any;
  title: string;
  user: any;
  dataOriginal: string;
  tempAnnotation: any;
  entries: any;
  public subtasks = [];
  marked: boolean = false;
  updateForm: FormGroup;
  index = 0;
  commentIndex=null;
  annoText: string;
  hidden = true;
  submitted = false;
  submission: any;
  activityName: string;
  editorConfig: any;
  activityType: string;
  htmlContent: any;
  clickedIndex = -1;
  studentString: string;
  studentEmail: string;
  studentContext: string;
  userStatus: any;
  dynamicFeedbackStr: string;
  isFeedbackSubmitted=false;

    //annotationStr: any;

@ViewChild('drawer') drawer: MatSidenav;
  constructor(
    public dialog: MatDialog, 
    public nav: NavbarService,
    private _formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private taskService:TaskService, 
    private activityService: ActivityService, 
    private authService:AuthService,
    private _location: Location,
     @Inject(DOCUMENT) document,
     private renderer: Renderer2) {
   }


  ngOnInit() {
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

    this.nav.hide();

    this.email = this.authService.loadEmail();
    console.log(this.email);
    //this.dataOriginal = "http://"+ this.email;
    this.dataOriginal = "http://test";
    console.log(this.dataOriginal);
     this.updateForm = this._formBuilder.group({
      updateCtrl: ['', Validators.required]
    });

    this.title = this.route.snapshot.paramMap.get('title');
    this.activityType = this.route.snapshot.paramMap.get('activitytype');
    this.activityName = this.route.snapshot.paramMap.get('activityname');
    this.taskService.getTaskMultiple(this.title, this.activityName).subscribe(data=>{
      console.log(data);
      this.image = data[0].originalname;
      this.url = '/api/image/'+ this.image;
      this.subtasks.push(data[0].task_desc);

      var pic = document.getElementById("image");
      anno.makeAnnotatable(pic);

      anno.setProperties({
        outline: 'red'
      });
      
      this.taskService.getAnnotationsByEmail(this.email, this.activityName, this.title).subscribe(data=>{
      this.annotations=data;
      if(this.annotations.length == 0){
        console.log("No submission yet!");
        this.submitted = false;
      }
      else{
        for(var i=0; i< this.annotations.length; i++){
          anno.addAnnotation(this.annotations[i]);
        }
        this.submitted = true;
        this.lockWidget();
      }

    });

      this.authService.getProfile().subscribe(data=>{
        console.log(data);
        this.user = {
          name:{
            first: data.user.first,
            last: data.user.last
          },
          email: data.user.email,
        };
      }

    )});

    /**Annotation handlers**/
    anno.addHandler('onAnnotationCreated', (data=> {
      console.log(data);
      this.annotation = {
      editable: false,
      src: data.src,
      text: data.text,
      shapes:[{
        type: "rect",
        geometry: {
          x: data.shapes[0].geometry.x,
          y: data.shapes[0].geometry.y,
          height: data.shapes[0].geometry.height,
          width: data.shapes[0].geometry.width
        }
      }],
      index: this.index,
      context:data.context,
      name: this.user.name,
      email: this.user.email,
      feedback: null,
      activity:{
        activityName: this.activityName,
        taskName: this.title
      },
    };
    this.index++;
      console.log(this.annotation);
       this.annotations.push(this.annotation);

    }));

    anno.addHandler('onAnnotationClicked',(data=>{
     this.studentEmail = data.email;
     this.studentString = data.name.first + " " + data.name.last;
     this.studentContext = data.context;
     this.clickedIndex = data.index;
      this.lockWidget();
      this.commentIndex = data.index;
      this.annoText = data.text;
      this.hidden = false;
      if(this.feedbackSubmitted()==true){
        this.isFeedbackSubmitted = true;
        this.dynamicFeedbackStr = this.annotations[this.clickedIndex].feedback;
      }
      else if(this.feedbackSubmitted() == false){
        this.isFeedbackSubmitted = false;
      }
      this.toggleSideNav();
    }));
    
    anno.addHandler('onAnnotationUpdated', (data=> {
      //console.log(data.index);
      console.log(data.shapes[0].geometry);
      for(var i=0; i<this.annotations.length; i++){
        if(this.compareGeoms(this.annotations[i].shapes[0].geometry, data.shapes[0].geometry)){
          //console.log("YES");
          this.annotations[i].text = data.text;
          console.log(this.annotations);
          console.log("Successful");
      }
      else{
        console.log("NO");
      }
    }
    
  }));

    anno.addHandler('onAnnotationRemoved', (data=>{
      const text_ = data.text;
      this.taskService.deleteAnnotation(text_).subscribe(data=>{
        console.log(data);
      })
      this.index--;
    }));

  }




  checkMarked(title){
    if(this.marked == false){
      this.marked = true;
    }
    else{
      this.marked = false;
    }
}
test(){
  //anno.hideAnnotations(this.annotations[1].src);
  var pic = document.getElementById("image").getAttribute("data-original");
  pic = "http://test@test.ie";
  //console.log( document.getElementById("image").getAttribute("data-original"));
  this.dataOriginal= pic;
  console.log(this.dataOriginal);
  anno.showAnnotations(this.dataOriginal);
}

onUpdateSubmit(index){
  this.tempAnnotation = this.annotations[index];
  // tempAnnotation.text = this.updateForm.get("updateCtrl").value;
  this.tempAnnotation.text = this.updateForm.get("updateCtrl").value;
  anno.addAnnotation(this.tempAnnotation, this.annotations[index]);
  this.annotations[index].update = false;
  console.log(this.annotations);
  this.updateForm.reset();
}

submitFeedback(text){
  let comment = {user: {
      first: this.user.name.first,
      last: this.user.name.last
      },
      index: this.clickedIndex,
      comment: text
      }
  this.activityService.updateFeedback(this.email, this.studentContext, comment, this.clickedIndex)
  .subscribe(data=>{
    console.log(data);
  });
  this.annotations[this.clickedIndex].feedback = text;
  console.log(this.annotations[this.clickedIndex].feedback);
  this.clear();
  this.toggleSideNav();
}

clear(){
  this.htmlContent = "";
}
empty(){
  alert("You have not typed anything to submit!")
}
feedbackSubmitted(){
  if(this.clickedIndex!= null && this.annotations[this.clickedIndex].feedback != null){
    return true;
  }
  else{
    return false;
  }
}

submitAllAnnotations(){
  
this.userStatus={
  activityName: this.activityName,
  taskName: this.title,
  submitted: true,
  count: this.annotations.length,
  email: this.email
};
  this.lockWidget();
  this.submitted=true;
   for(var i =0; i<this.annotations.length; i++){
       this.taskService.submitAnnotation(this.annotations[i]).subscribe(data=>{
          console.log(data);
    });

   }
   this.activityService.updateUserSubmission(this.user.email, this.userStatus).subscribe(data=>{
     console.log(data);
     if(this.activityType == 'Group'){
       let groupUserStatus = {
         taskName: this.title,
         first: this.user.name.first,
         last: this.user.name.last,
         email: this.user.email
       }
     this.activityService.updateSubmissions(this.activityName, groupUserStatus).subscribe(data=>{
       console.log(data);
     })
   }
   });

   
}

compareGeoms(geom1, geom2){
  if(geom1.x == geom2.x && geom1.y == geom2.y && geom1.height == geom2.height && geom1.width == geom2.width){
    return true;
  }
  else{
    return false;
  }
  
}

lockWidget(){
  anno.hideSelectionWidget();

  }
 showWidget(){
   anno.showSelectionWidget();
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

/**Dialog code**/

  openTaskDialog() {

        let dialogRef = this.dialog.open(AnnotateTaskDialogComponent , {
        data: {
          tasks: this.subtasks
        },
        width: "300px",
        height: "250px"
      });
    }
  openConfirmDialog() {

      let dialogRef = this.dialog.open(AnnotateConfirmDialogComponent,{
        data:{
          annotations: this.annotations
        }
      });
      dialogRef.afterClosed().subscribe(result => {
           if(result == true){
             this.submitAllAnnotations();
             this.openSubmittedDialog();
           }
           else{
             console.log("closing");
           }
          
          });
    }
    openSubmittedDialog(){
      let dialogRef = this.dialog.open(AnnotateSubmittedDialogComponent,{
      });
      dialogRef.afterClosed().subscribe(result => {
        this.nav.show();
        if(this.activityType == 'Group'){
          this.router.navigate(['group/', this.activityName]);
        }
        else if(this.activityType == 'Individual'){
          this.router.navigate(['activity/', this.activityName]);
        }
      }

    )}
 }


@Component({
  selector: 'annotate-dialog',
  templateUrl: 'annotate-task-dialog.html',
})
export class AnnotateTaskDialogComponent {
   @ViewChild("annotate-Component") annotateComponent: AnnotateComponent;
  constructor(
    public dialogRef: MatDialogRef<AnnotateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'annotate-dialog',
  templateUrl: 'annotate-confirm-dialog.html',
})

export class AnnotateConfirmDialogComponent {
  @ViewChild("annotate-Component") annotateComponent: AnnotateComponent;
  constructor(
    public dialogRef: MatDialogRef<AnnotateConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'annotate-dialog',
  templateUrl: 'annotate-submitted-dialog.html',
})
export class AnnotateSubmittedDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnnotateSubmittedDialogComponent>) {}
}
