import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
// Imports for loading & configuring the in-memory web api



import { ItemListComponent } from './item-list.component';
import { ItemMaxListComponent } from './item-max.component';
import { ItemEditComponent } from './item-edit.component';
import { ItemEditGuard } from './item-edit.guard';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'items', component: ItemListComponent },
      { path: 'maxitems', component: ItemMaxListComponent }
    ,
    {
      path: 'items/:id/edit',
      canDeactivate: [ItemEditGuard],
      component: ItemEditComponent
    }
  ])

  ],
  declarations: [
    ItemListComponent,
    ItemMaxListComponent,
    ItemEditComponent
  ]
})
export class ItemModule { }
