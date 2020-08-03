import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {ClassService} from '../../services/class.service';
import {AuthService} from '../../services/auth.service';
import {TaskService} from '../../services/task.service';
import {ActivityService} from '../../services/activity.service';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import {annotator} from 'annotator';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {FormGroup, FormControl, FormBuilder,Validators} from '@angular/forms';
import { Lightbox } from 'angular2-lightbox';

declare var anno: any;
declare var jQuery: any


@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {

  //students = new FormControl();
  //toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  /*Task variables*/
  isMember=false;
  done: boolean = true;
  submitted: boolean = true;
  teacherEmail: string;
  groupname: string;
  add: boolean = false;
  makingTask: boolean = false;
  submission: boolean =false;
  isGroup: boolean = false;
  displayedColumns = ['name', 'type', 'preview'];
  url = "";
  taskStr: any;
  taskName: string;
  taskDesc: string;
  taskType: string;
  taskImage: string;
  value: any;
  task: any;
  public tasks = [];
  public taskFiles=[];
  taskForm: FormGroup;
  public taskCount;
  selected:any;

  /**Task Preview Varables**/
  imageSrc: string;
  tempDesc: string;
  tempName: string;

  /*Activity variables*/
  activityStr: any;
  activityObj: any;
  activityName: string;
  activityType: string;
  public activities = [];
  activityNameForm: FormGroup;
  activityTypeForm: FormGroup;
  public activityCount;
  studentGroup = [];

  /*File variables*/
  public files2: UploadFile[] = [];
  public files1 = [];
  public file: any;
  /*Misc variables (for now)*/
  title: String;
  module_code: String;
  email: String;
  class: Object;
 images = [];

  user: any;

  first: String;
  last: String;
  teacher: String;
  role: String;
  originalName: String;
  isTeacher: Boolean=false;
  id=1;
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    class: 'modal-lg'
  };
  config2 = {
    animated: true,
    keyboard: true,
    class: 'modal-dialog-centered'
  };
  panelOpenState = false;
  isLinear = true;
  status: boolean = false;
  studentList = [];
  taskIndex: any;
  htmlContent: any;
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

  @ViewChild('text') card;
  
  constructor(private _lightbox: Lightbox, 
    private _formBuilder: FormBuilder, 
    private modalService: BsModalService,
    private taskService: TaskService,
    private classService: ClassService, 
    private authService: AuthService, 
    private activityService: ActivityService,
    private route: ActivatedRoute, 
    private router: Router, private http: HttpClient) {

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    }
  }

  selectedFile = null;
  
  ngOnInit() {

    this.email = this.authService.loadEmail();

    const module = this.route.snapshot.paramMap.get('classname');
    console.log(module);

    this.activities=[];
    this.taskIndex = this.tasks.length;

    this.activityNameForm = this._formBuilder.group({
      activityNameCtrl: ['', Validators.required]
    });
    //this.taskName = this.activityNameForm.controls['activityNameCtrl'].value;
    this.activityTypeForm = this._formBuilder.group({
      activityTypeCtrl: ['', Validators.required],
      students: [''],
      groupNameCtrl: ['']
    });
    this.taskForm = this._formBuilder.group({
      taskNameCtrl: [''],
      taskDescCtrl: [''],
      taskTypeCtrl: ['']
    });

    this.taskService.clearFile();

    if(this.authService.isTeacher()){
      this.isTeacher=true;
    }
  	this.classService.getClassByModule(module).subscribe(data =>{
      console.log(data);
      this.class = data;
      this.title = data.title;
      this.module_code = data.module_code;
      this.teacherEmail = data.teacher.email;
      this.classService.getTeacher(this.teacherEmail).subscribe(data=>{
        this.first = data.first;
        this.last= data.last;
        this.role = data.role;
        this.teacher = this.first + " " + this.last;
      

        this.classService.getStudentsByModule(this.module_code).subscribe(data=>{
          this.studentList = data;

        });
      });

      this.activityService.getActivitiesByModule(this.module_code).subscribe(data=>{
        if(!this.isTeacher){
          for(var i = 0; i<data.length; i++){
          if(data[i].activityType == 'Group'){
            this.checkGroup(data[i].group)
            if(this.isMember){
              this.activities.push(data[i]);
            }
            else{
              console.log("Not in group");
            }
          }
          else if(data[i].activityType == 'Individual'){
            this.activities.push(data[i]);
          }
        }
        }
        else if(this.isTeacher){
          this.activities = data;
        }
            this.taskService.getTaskByModule(this.module_code).subscribe(data=>{
              this.images = data;
            })
          });
      this.authService.getProfile().subscribe(data=>{
        this.user = data.user;
        console.log(this.user);
      });
  	},
  	err =>{
  		console.log(err);
  		return false;
  	});

  }
public dropped(event: UploadEvent) {
    this.files2 = event.files;
    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
           this.file = file;
           console.log(this.file);
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          var reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = (event: any) => {
            this.url = event.target.result;
          }
          console.log(this.url);
 
        });
      } else {
        
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

  delete(thisId){
    console.log(thisId);
    const url = 'http://localhost:3000/files/'+thisId;
    this.http.delete(url)
    .subscribe(res=>{
      console.log(res);
    });
    location.reload();
}
getTaskDesc(title, desc){
  this.taskName = title;
  this.taskDesc = desc;
}
  openModal(template: TemplateRef<any>) {
    this.activityNameForm.reset();
    this.activityTypeForm.reset();
    this.taskForm.reset();
    this.tasks = [];
    this.modalRef = this.modalService.show(template, this.config);
  }
  openImagePreview(template: TemplateRef<any>,actname, title) {
      for(var i=0; i<this.images.length; i++){
        if(this.images[i].activity_name == actname && this.images[i].task_title == title){
          this.imageSrc = "/api/image/"+ this.images[i].originalname;
          this.tempDesc = this.images[i].task_desc;
          this.tempName = this.images[i].task_title;
        }
      }
    this.config.class="modal-md";
        this.modalRef = this.modalService.show(template, this.config2);
  }
  openTextPreview(template: TemplateRef<any>,title, desc) {
    this.tempName = title;
    this.tempDesc = desc;
    this.config.class="modal-md";
        this.modalRef = this.modalService.show(template, this.config2);
  }

addTask(){
  this.taskName = this.taskForm.get('taskNameCtrl').value;
}
submitTask(){
  this.taskDesc = this.htmlContent;
  console.log(this.taskForm.get('taskNameCtrl').value);
  this.taskType = this.taskForm.get("taskTypeCtrl").value;
  if(this.taskType =='image'){
    this.taskStr= {
      task_name: this.taskName, 
      task_type: "image", 
      task_desc: this.taskDesc, 
      index: this.taskIndex
    };
    this.tasks.push(this.taskStr);
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('activityName',this.activityName);
    formData.append('taskName', this.taskName);
    formData.append('taskDesc', this.taskDesc);
    formData.append('taskType', this.taskType);
    formData.append('index', this.taskIndex);
    this.http.post('http://localhost:3000/upload/image/'+this.module_code, formData)
      .subscribe(res=>{
        console.log(res);
      });

  }
  if(this.taskType=='text'){
    this.taskStr= {task_name: this.taskName, task_type: "text", task_desc: this.taskDesc, index: this.taskIndex};
    this.tasks.push(this.taskStr);
  }
  console.log(this.tasks);
  this.taskForm.reset();
  this.url=null;
  this.taskName=null;
  this.taskDesc=null;
  this.taskType=null;
  this.selected=null;

}

deleteActivity(activityName){
  this.activityService.deleteActivity(activityName).subscribe(data=>{
    console.log(data);
  });
  this.taskService.deleteTasksByActivity(activityName).subscribe(data=>{
      console.log(data);
    });

  location.reload();
}

submitActivity(){
  

    this.activityCount++;
    this.activityStr={activityName: this.activityName, activityType: this.activityType, group: this.studentGroup, module_code: this.module_code, tasks: this.tasks, comments: [], submissions:[] };
    this.activities.push(this.activityStr);
    console.log(this.activityStr);
    this.tasks=[];
    this.taskService.submitActivity(this.activityStr).subscribe(
        data=>{
          console.log(data)
          this.activityNameForm.reset();
          this.activityTypeForm.reset();
          this.taskForm.reset();
        },
        err=>{
          console.log(err);
        });
    location.reload();
    };

clearURL(){
  this.url = null;
}
onActivityNameSubmit(): void {
  this.activityName = this.activityNameForm.get('activityNameCtrl').value;
    console.log(this.activityName);
} 
onActivityTypeSubmit(): void {
  this.groupname = this.activityTypeForm.get('groupNameCtrl').value;
  this.activityType = this.activityTypeForm.get('activityTypeCtrl').value;
  console.log(this.activityType);
  if(this.activityType == 'Group'){
    var studentList = this.activityTypeForm.get("students").value;
    
    for(var i = 0; i<studentList.length; i++){
      this.studentGroup.push({
        first: studentList[i].first,
        last: studentList[i].last,
        email: studentList[i].email,
        groupname: this.groupname
      });

    }
  }
  else{
    console.log("Individual");
  }
}
onTaskNameSubmit(): void {
    this.taskName = this.taskForm.get('taskNameCtrl').value
    console.log(this.taskName);
    //this.tasks.push(this.task);
}
onTaskTypeSubmit(): void{
  this.taskType = this.taskForm.get("taskTypeCtrl").value;
  console.log(this.taskType);
}

checkGroup(group){
  for(var i = 0; i< group.length; i++){
      if(this.user.first == group[i].first && this.user.last == group[i].last || this.isTeacher){
        this.isMember = true;
      }
      else{
        this.isMember = false;
      }
  }
}

group(){
  this.isGroup = true;
}
notGroup(){
  this.isGroup = false;
}

checkSubmitted(){
  return false;

}
}


