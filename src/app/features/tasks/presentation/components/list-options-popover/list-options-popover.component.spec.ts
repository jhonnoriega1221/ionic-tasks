import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ListOptionsPopoverComponent } from "./list-options-popover.component";

describe("ListOptionsPopoverComponent", () => {
    let component: ListOptionsPopoverComponent;
    let fixture: ComponentFixture<ListOptionsPopoverComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ListOptionsPopoverComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ListOptionsPopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
