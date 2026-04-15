import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { APIResponse } from '../../models/Response.model';
import { PazienteDTO } from '../Pazienti.model';


/**
 * se OK -> si va alla modifica
 * se KO -> si va a accettazione
 * e decido io hahahahah scemoooo
 * 
 * @param route
 * @param state
*/
export const patientInfoResolver: ResolveFn<Observable<APIResponse<PazienteDTO> | undefined>> = (
  route, 
  state
) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const patientId = route.paramMap.get('patientId');

  return http.get<APIResponse<PazienteDTO>>(`/api/admissions/${patientId}`).pipe(
    catchError((error) => {
      console.error('Error fetching patient info:', error);
      router.navigate(['/accettazione-pz']);
      return of(undefined);
    })
  );
};
