import { Inject, Injectable } from '@angular/core';
import {
  AirNodes,
  ANdata,
  Network,
  Users,
} from 'src/interfaces/data-firestore.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateCalculationService } from './date-calculation.service';

@Injectable({
  providedIn: 'root',
})
export class DataCurrentDayService {
  private wmtDataSubject: BehaviorSubject<AirNodes[]> = new BehaviorSubject(
    [] as AirNodes[]
  );
  public readonly wmtData: Observable<AirNodes[]> =
    this.wmtDataSubject.asObservable();

  private networkDataSubject: BehaviorSubject<Network[]> = new BehaviorSubject(
    [] as Network[]
  );
  public readonly networkData: Observable<Network[]> =
    this.networkDataSubject.asObservable();

  private userDataSubject: BehaviorSubject<Users[]> = new BehaviorSubject(
    [] as Users[]
  );
  public readonly userData: Observable<Users[]> =
    this.userDataSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private _dateCalc: DateCalculationService
  ) {
    let startDate = this._dateCalc.getNowTimeStamp().firstOfDay;

    this.firestore
      .collection<AirNodes>('WMT Scan Scraper', (ref) =>
        ref.orderBy('timestamp').startAt(startDate)
      )
      .valueChanges()
      .subscribe((data) => {
        this.wmtDataSubject.next(data);

        this.userDataSubject.next(
          data.map((data) => ({
            t: data.timestamp,
            users: data.users,
          }))
        );

        this.networkDataSubject.next(
          data.map((data) => ({
            t: data.timestamp,
            network:
              Math.round((data.network_usage / (1024 * 1024 * 1024)) * 100) /
              100,
          }))
        );
      });
  }

  ngOnInit(): void {}
}