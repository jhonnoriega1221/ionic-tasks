import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, getBoolean } from "firebase/remote-config";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class FirebaseRemoteConfigService {
    private remoteConfig;

    constructor() {
        const app = initializeApp(environment.firebaseConfig);
        this.remoteConfig = getRemoteConfig(app);

        this.remoteConfig.settings.minimumFetchIntervalMillis = 10000;
    }

    async isFeatureEnabled(flagName: string): Promise<boolean> {
        try {
            await fetchAndActivate(this.remoteConfig);

            return getBoolean(this.remoteConfig, flagName);
        } catch (error) {
            console.error("Error fetching remote config:", error);
            return false;
        }
    }
}
