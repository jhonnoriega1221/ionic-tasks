import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { environment } from "../../../../../../environments/environment";
import { ThemeService } from "src/app/core/theme.service";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.page.html",
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class SettingsPage implements OnInit {
    showAdvancedFeature = false;
    isDarkMode = false;
    appVersion = environment.version;

    constructor(private themeService: ThemeService) {}

    async ngOnInit() {
        this.isDarkMode = await this.themeService.isDarkModeEnabled();
    }

    async toggleDarkMode(event: any) {
        this.isDarkMode = event.detail.checked;
        await this.themeService.setDarkMode(this.isDarkMode);
    }
}
