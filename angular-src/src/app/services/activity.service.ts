import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: Http) { }

  getActivities(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('activities/all', {headers: headers})
    .pipe(map(res=> res.json()));
  }
   getActivityByTitle(title){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('activity/'+ title, {headers: headers})
    .pipe(map(res=> res.json()));
  }

    getActivitiesByModule(module){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('activity/module/'+ module, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  updateComments(activity, comment){let body = {
      activityName: activity,
      comment: comment
    }
    const headers = new Headers({
      'Content-Type':  'application/json'
    });
    return this.http.put('activity/comments/update', body, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  deleteActivity(activity){
   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('activity/delete/'+ activity, {headers: headers})
    .pipe(map(res=> res.json()));
 }

   updateSubmissions(activity, sub){
     let body = {
       activityname: activity,
        submission: sub
    }
    const headers = new Headers({
      'Content-Type':  'application/json'
    });
    return this.http.put('activity/submissions/update', body, {headers: headers})
    .pipe(map(res=> res.json()));
  }
    

  updateUserSubmission(email, sub){
    let body = {
      submission: sub
    }
    const headers = new Headers({
      'Content-Type':  'application/json'
    });
    return this.http.put('user/update/submission/'+email, body, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  updateFeedback(email, context, feedback, index){
    let body={
      email: email,
      feedback: feedback,
      context: context,
      index: index
    }
    const headers = new Headers({
      'Content-Type':  'application/json'
    });
    return this.http.put('annotation/feedback', body, {headers: headers})
    .pipe(map(res=> res.json()));
  }

  getComments(activityName){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('activity/group/'+activityName+'/comments', {headers: headers})
    .pipe(map(res=> res.json()));
  }



}
