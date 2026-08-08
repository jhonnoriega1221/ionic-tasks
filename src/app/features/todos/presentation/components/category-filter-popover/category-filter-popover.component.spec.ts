import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CategoryFilterPopoverComponent } from "./category-filter-popover.component";

describe("CategoryFilterPopoverComponent", () => {
    let component: CategoryFilterPopoverComponent;
    let fixture: ComponentFixture<CategoryFilterPopoverComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CategoryFilterPopoverComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryFilterPopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
