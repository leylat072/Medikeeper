import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Item } from './item';
import { ItemService } from './item.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './item-edit.component.html'
})
export class ItemEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Item Edit';
  errorMessage: string;
  itemForm: FormGroup;

  item: Item;
  private sub: Subscription;
  id = 0;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return this.itemForm.get('tags') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      itemName: {
        required: 'Item name is required.',
        minlength: 'Item name must be at least three characters.',
        maxlength: 'Item name cannot exceed 50 characters.'
      },
      itemCost: {
        required: 'Item code is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      itemCost: ['', Validators.required]
    });

    // Read the item Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        this.id = +params.get('id');
        this.getItem(this.id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification
    // on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.itemForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.itemForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getItem(id: number): void {
    this.itemService.getItem(id)
      .subscribe({
        next: (item: Item) => this.displayItem(item),
        error: err => this.errorMessage = err
      });
  }

  displayItem(item: Item): void {
    if (this.itemForm) {
      this.itemForm.reset();
    }
    this.item = item;

    if (this.item.id === 0) {
      this.pageTitle = 'Add Item';
    } else {
      this.pageTitle = `Edit Item: ${this.item.name}`;
    }

    // Update the data on the form
    this.itemForm.patchValue({
      itemName: this.item.name,
      itemCost: this.item.cost
    });

  }

  deleteItem(): void {
    if (this.item.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the item: ${this.item.name}?`)) {
        this.itemService.deleteItem(this.item.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveItem(): void {
    if (this.itemForm.valid) {
      if (this.itemForm.dirty) {

        const p = {
          id: this.id,
          name : this.itemForm.value.itemName,
          cost : Number(this.itemForm.value.itemCost)
        };


        if (p.id === 0) {
          this.itemService.createItem(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }else {
          this.itemService.updateItem(p)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.itemForm.reset();
    this.router.navigate(['/items']);
  }
}
