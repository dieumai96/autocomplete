import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { filter } from 'minimatch';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild("searchAutoComplele", { static: false }) searchAutoComplele: ElementRef;
  title = 'autocomplete-search';
  constructor(private http: HttpClient) { }
  ngAfterViewInit() {
    fromEvent(this.searchAutoComplele.nativeElement, 'keyup').pipe(
      map((event: Event) => (<HTMLInputElement>event.target).value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(key => this.http.get(`https://api.github.com/search/repositories?q=${key}`).pipe(
        catchError(err => of(err))
      ))
    ).subscribe(data => console.log(data));
  }
}
