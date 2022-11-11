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
export class AirnodeQueryDataService {
  start: string = '10-11-2022 00:00:00';
  end: string = '11-11-2022 00:00:00';

  private wmtDataSubject: BehaviorSubject<AirNodes[]> = new BehaviorSubject(
    [] as AirNodes[]
  );
  public readonly wmtData: Observable<AirNodes[]> =
    this.wmtDataSubject.asObservable();
  // comeme la pinga?
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

  constructor(private firestore: AngularFirestore) {
    this.firestore
      .collection<AirNodes>('WMT Scan Scraper', (ref) =>
        ref.orderBy('timestamp').startAt(this.start).endAt(this.end)
      )
      .valueChanges()
      .subscribe((data) => {
        console.log(
          '%cchart.component.ts line:26 data',
          'color: #007acc;',
          data
        );

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

  getUserData() {
    console.log(this.userData);
  }

  getNetworkData() {
    console.log(this.networkData);
  }
}
