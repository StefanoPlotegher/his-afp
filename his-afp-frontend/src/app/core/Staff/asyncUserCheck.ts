import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { StaffManager } from "./staff-manager";
import { catchError, map, Observable, of, pipe, switchMap, take, timer } from "rxjs";

export class AsyncUserCheck{
    static check(staffManager: StaffManager): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const value = control.value?.trim();

            if (!value) {
                return of(null);
            }

            return timer(500).pipe(
                switchMap(() => staffManager.ricercaStaff(value)),
                map((res) => (
                    res.data.available ? null : { usernameTaken: true }
                )),
                catchError(() => of(null)),
                take(1),
            );
        };
    }
}