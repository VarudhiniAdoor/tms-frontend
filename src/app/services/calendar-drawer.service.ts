import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalendarDrawerService {
  private _open = new BehaviorSubject<boolean>(false);
  open$ = this._open.asObservable(); // components can listen to this

  open() { this._open.next(true); }
  close() { this._open.next(false); }
  toggle() { this._open.next(!this._open.value); }
}
