import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MockDataService } from 'src/app/services/mock-data.service';
import { Item } from 'src/app/types';
import { isValidRegex } from 'src/app/utils/regex';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  filterForm: FormControl;
  subscriptions = new Subscription();

  arrListOriginal: Item[] = [];
  arrListFiltered: Item[] = [];

  constructor(private svcMockData: MockDataService) {}

  ngOnInit(): void {
    this.initForm();
    this.initList();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    this.filterForm = new FormControl();
    this.subscriptions.add(
      this.filterForm.valueChanges.subscribe((filterValue) => {
        if (filterValue) this.onFilterChange(filterValue);
        else this.arrListFiltered = this.arrListOriginal;
      })
    );
  }

  initList(): void {
    this.svcMockData.getData().subscribe((arr) => {
      this.arrListOriginal = arr;
      this.arrListFiltered = arr;
    });
  }

  setSelectedItem(obj: Item): void {
    this.svcMockData.setSelectedObj(obj);
  }

  private onFilterChange(inputSearched: string) {
    let isRegexValid = isValidRegex(inputSearched);
    let search = !isRegexValid
      ? inputSearched.toLowerCase().replace(',', '.')
      : inputSearched;

    this.arrListFiltered = this.arrListOriginal.filter((obj: Item | any) => {
      let isNameMatch = !isRegexValid
        ? obj.name.toLowerCase().includes(search)
        : new RegExp(inputSearched).test(obj.name);

      let strPrice = obj?.price?.toFixed(2)?.toString();
      let isPriceMatch = !isRegexValid
        ? strPrice?.includes(search)
        : new RegExp(inputSearched).test(strPrice);

      let isPremium = obj?.premium;

      return isNameMatch || isPriceMatch || isPremium;
    });
  }
}
