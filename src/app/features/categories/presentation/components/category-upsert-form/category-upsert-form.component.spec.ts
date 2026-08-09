import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CategoryUpsertFormComponent } from "./category-upsert-form.component";

describe("CategoryUpsertFormComponent", () => {
    let component: CategoryUpsertFormComponent;
    let fixture: ComponentFixture<CategoryUpsertFormComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CategoryUpsertFormComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryUpsertFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
