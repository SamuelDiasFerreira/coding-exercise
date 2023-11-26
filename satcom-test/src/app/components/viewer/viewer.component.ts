import { Customer } from './../../models/customer';
import {
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerComponent } from '../customer/customer.component';
import { PremiumProductComponent } from '../premium-product/premium-product.component';
import { ProductComponent } from '../product/product.component';
import { DynamicComponentsMapperUtils } from '../../utils/dynamic-components-mapper.utils';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { MockDataService } from 'src/app/services/mock-data.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  currentComponent: ComponentRef<
    CustomerComponent | PremiumProductComponent | ProductComponent
  >;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private svcMockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initData(): void {
    this.svcMockData
      .getSelectedObj()
      .subscribe((obj: any) => this.addDetailsComponentToView(obj));
  }

  addDetailsComponentToView(element: Customer | Product): void {
    if (this.currentComponent != null) {
      this.currentComponent.destroy();
    }
    const component = DynamicComponentsMapperUtils.getComponent(element);
    this.currentComponent = this.viewContainerRef.createComponent(component);
    this.currentComponent.instance.element = element;
    this.viewContainerRef.insert(this.currentComponent.hostView);
  }
}
