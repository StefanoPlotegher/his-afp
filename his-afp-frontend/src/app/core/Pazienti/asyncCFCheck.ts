import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { PatientManager } from "./patient-manager";
import { catchError, map, Observable, of, pipe, switchMap, take, timer } from "rxjs";

export class AsyncCFCheck{
    static check(pzManager: PatientManager): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value){
                return of(null);
            }

            return timer(500).pipe(
                switchMap(()=> pzManager.ricefcaPaziente(control.value)),
                map((res) => (
                    res.results && res.results > 0 ? {cfExists: true} : null
                )),
                catchError(()=> of(null)),
                take(1),
            );
        };
    }
}