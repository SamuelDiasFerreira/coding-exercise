import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, Subject, of } from 'rxjs';
import { Customer } from '../models/customer';
import { Item } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private mockDataNumber = 30;
  private objSelected: Subject<Item> = new Subject();

  constructor() {}

  getData(): Observable<Item[]> {
    const data = [];

    for (let i = 0; i < this.mockDataNumber; i++) {
      data.push(
        Math.random() > 0.5
          ? this.createRandomProduct(i)
          : this.createRandomCustomer(i)
      );
    }

    return of(data);
  }

  private createRandomProduct(index: number): Product {
    return {
      name: `Product-${index}`,
      productNumber: `${index}`,
      price: Math.random() * 30,
      premium: Math.random() > 0.5,
    };
  }

  private createRandomCustomer(index: number): Customer {
    return {
      name: `Customer-${index}`,
      birthDate: new Date(Math.floor(Math.random() * Date.now())),
    };
  }

  public getSelectedObj(): Observable<Item> {
    return this.objSelected.asObservable();
  }

  public setSelectedObj(obj: Item): void {
    this.objSelected.next(obj as any);
  }
}
