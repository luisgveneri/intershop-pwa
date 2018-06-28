import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../models/product/product.model';
import { ProductAddToQuoteComponent } from './product-add-to-quote.component';

describe('Product Add To Quote Component', () => {
  let component: ProductAddToQuoteComponent;
  let fixture: ComponentFixture<ProductAddToQuoteComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductAddToQuoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku', inStock: true, availability: true, minOrderQuantity: 1 } as Product;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show button when display type is not glyphicon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('btn-default');
  });

  it('should show glyphicon button when display type is glyphicon ', () => {
    component.displayType = 'glyphicon';
    fixture.detectChanges();
    expect(element.querySelector('span').className).toContain('glyphicon');
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });
});
