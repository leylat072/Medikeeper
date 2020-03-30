import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'https://localhost:44390/item';
  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/items`;
    return this.http.get<Item[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getMaxItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/maxitems`;
    return this.http.get<Item[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
        );
    }

  getItem(id: number): Observable<Item> {
    if (id === 0) {
      return of(this.initializeItem());
    }
    const url = `${this.baseUrl}/itembyid/${id}`;
    return this.http.get<Item>(url)
      .pipe(
        tap(data => console.log('getItem: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createItem(item: Item): Observable<Item> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url = `${this.baseUrl}/add`;
    return this.http.post<Item>(url, item, { headers })
      .pipe(
        tap(data => console.log('createItem: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteItem(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<Item>(url, { headers })
      .pipe(
        tap(data => console.log('deleteItem: ' + id)),
        catchError(this.handleError)
      );
  }

  updateItem(item: Item): Observable<Item> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/edit`;
    return this.http.put<Item>(url, item, { headers })
      .pipe(
        tap(() => console.log('updateItem: ' + item.id)),
        // Return the item on an update
        map(() => item),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeItem(): Item {
    // Return an initialized object
    return {
      id: null,
      name: null,
      cost: null
    };
  }
}
