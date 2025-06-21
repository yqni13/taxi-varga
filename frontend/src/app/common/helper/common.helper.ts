import { Router } from "@angular/router";

export const navigateWithRoute = (route: string | null, router: Router) => {
    if(route === null) {
        return;
    }

    router.navigate([`/${route}`]);
}