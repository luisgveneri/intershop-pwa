import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Basket } from '../../../../models/basket/basket.model';
import { ShippingMethod } from '../../../../models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  basket: Basket;
  @Input()
  shippingMethods: ShippingMethod[];
  @Input()
  error: HttpErrorResponse;

  @Output()
  updateShippingMethod = new EventEmitter<string>();

  shippingForm: FormGroup;
  destroy$ = new Subject();

  constructor(private router: Router) {}

  ngOnInit() {
    this.shippingForm = new FormGroup({
      id: new FormControl(this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : ''),
    });

    // trigger update shipping method if selection changes
    this.shippingForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingId => this.updateShippingMethod.emit(shippingId));
  }

  /**
   * set shipping selection to the corresponding basket value (important in case of an error)
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.basket && this.shippingForm) {
      this.shippingForm
        .get('id')
        .setValue(this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : '', { emitEvent: false });
    }
  }

  /**
   * leads to next checkout page (checkout payment)
   */
  nextStep() {
    this.router.navigate(['/checkout/payment']);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}