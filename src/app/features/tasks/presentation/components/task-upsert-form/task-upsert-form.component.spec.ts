import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TaskUpsertFormComponent } from "./task-upsert-form.component";

describe("TaskUpsertFormComponent", () => {
    let component: TaskUpsertFormComponent;
    let fixture: ComponentFixture<TaskUpsertFormComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TaskUpsertFormComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskUpsertFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
