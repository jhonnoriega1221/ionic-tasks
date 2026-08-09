import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CategoryCreationFormComponent } from "./category-creation-form.component";

describe("CategoryCreationFormComponent", () => {
    let component: CategoryCreationFormComponent;
    let fixture: ComponentFixture<CategoryCreationFormComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CategoryCreationFormComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryCreationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
