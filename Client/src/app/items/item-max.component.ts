import { Component, OnInit } from '@angular/core';

import { Item } from './item';
import { ItemService } from './item.service';

@Component({
  templateUrl: './item-max.component.html',
  styleUrls: ['./item-max.component.css']
})
export class ItemMaxListComponent implements OnInit {
  pageTitle = 'ItemMax List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  // tslint:disable-next-line: variable-name
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredItemMax = this.listFilter ? this.performFilter(this.listFilter) : this.itemMaxes;
  }

  filteredItemMax: Item[] = [];
  itemMaxes: Item[] = [];

  constructor(private itemService: ItemService) { }

  performFilter(filterBy: string): Item[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.itemMaxes.filter((itemMax: Item) =>
      itemMax.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.itemService.getMaxItems().subscribe({
      next: itemsMax => {
        this.itemMaxes = itemsMax;
        this.filteredItemMax = this.itemMaxes;
      },
      error: err => this.errorMessage = err
    });
  }
}
