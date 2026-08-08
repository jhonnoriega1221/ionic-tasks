import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: "root"
})
export class ThemeService {
    private readonly STORE_NAME = "settings";
    private readonly THEME_KEY = "isDarkMode";

    private mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    constructor(private storage: StorageService) {
        this.mediaQuery.addEventListener("change", async (e) => {
            const isDarkSaved = await this.storage.get<boolean>(this.STORE_NAME, this.THEME_KEY);

            if (isDarkSaved === null) {
                this.applyThemeClass(e.matches);
            }
        });
    }

    async initTheme(): Promise<void> {
        const isDarkSaved = await this.storage.get<boolean>(this.STORE_NAME, this.THEME_KEY);

        if (isDarkSaved !== null) {
            this.applyThemeClass(isDarkSaved);
        } else {
            this.applyThemeClass(this.mediaQuery.matches);
        }
    }

    async setDarkMode(isDark: boolean): Promise<void> {
        this.applyThemeClass(isDark);
        await this.storage.set(this.STORE_NAME, this.THEME_KEY, isDark);
    }

    async isDarkModeEnabled(): Promise<boolean> {
        const isDarkSaved = await this.storage.get<boolean>(this.STORE_NAME, this.THEME_KEY);
        return isDarkSaved !== null ? isDarkSaved : this.mediaQuery.matches;
    }

    private applyThemeClass(isDark: boolean) {
        document.documentElement.classList.toggle("ion-palette-dark", isDark);
    }
}
