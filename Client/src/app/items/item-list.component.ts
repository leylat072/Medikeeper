import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from './item';
import { ItemService } from './item.service';

@Component({
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  pageTitle = 'Item List';
  errorMessage = '';
  enableEdit = false;
  enableEditIndex = null;
  editField = null;
  enableAdd = false;

  items: Item[] = [];
  itemIsEditing: Item;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private router: Router) { }


  ngOnInit(): void {
    this.itemService.getItems().subscribe({
      next: data => {
        this.items = data;
        console.log(this.items[0]);
       },
      error: err => {
        this.errorMessage = err;
        console.log(err);}
    });
  }
  deleteItem(id: number, name: string): void {
    if (id=== 0) {
      // Don't delete, it was never saved.

    } else {
      if (confirm(`Really delete the product: ${name}?`)) {

        this.itemService.deleteItem(id)
          .subscribe({
            next: () => {
              const filteredItems = this.items.filter(item => item.id !== id);
              this.items = filteredItems;
            },
            error: err => this.errorMessage = err
          });
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags

    this.router.navigate(['/items']);
  }

  save(): void {
    this.enableEdit = false;
    const id = this.itemIsEditing.id;


    const p = {
      id: this.items[id].id,
      name : this.items[id].name,
      cost : Number(this.items[id].cost)
    };

    this.itemService.updateItem(p)
      .subscribe({
        next: () => this.onSaveComplete(),
        error: err => this.errorMessage = err
      });

  }
  cancel(): void {
    this.enableEdit = false;
    const id = this.itemIsEditing.id;
    this.items[id].cost = this.itemIsEditing.cost;
    this.items[id].name = this.itemIsEditing.name;

  }
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.itemIsEditing = this.itemIsEditing ??  {id,
    name : this.items[id].name, cost : this.items[id].cost};
    this.items[id][property] = editField;
  }
  remove(id: any) {
    //this.awaitingPersonList.push(this.personList[id]);
    //this.personList.splice(id, 1);
  }

  add() {
    /*if (this.awaitingPersonList.length > 0) {
      const person = this.awaitingPersonList[0];
      this.personList.push(person);
      this.awaitingPersonList.splice(0, 1);
    }*/
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }


  enableEditMethod(e, i) {
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
    setTimeout(() => {
      // set a custom colIndex and pass it to the method below
   // document.querySelector(`.k-grid-edit-row > td:nth-child(${i + 1}) input`).focus();
  });
  }

}
