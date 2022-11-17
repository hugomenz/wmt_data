import { Injectable } from '@angular/core';
import {
  AirNodes,
  ANdata,
  Network,
  Users,
} from 'src/interfaces/data-firestore.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AirnodeDataService {
  constructor(private firestore: AngularFirestore) {}

  getData(startDate: string, endDate: string): Observable<AirNodes[]> {
    return this.firestore
      .collection<AirNodes>('WMT Scan Scraper', (ref) =>
        ref.orderBy('timestamp').startAt(startDate).endAt(endDate)
      )
      .valueChanges();
  }

  ngOnInit(): void {}
}
