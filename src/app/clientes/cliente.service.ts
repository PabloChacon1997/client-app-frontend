import { Injectable } from '@angular/core';
// import { CLIENTES} from './clientes.json';
import { Cliente} from './cliente';
import { Observable, pipe , throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // private urlEndpoint: string = 'http://localhost:8080/api/clientes';
  private urlEndpoint: string = 'https://backend-client-app.herokuapp.com/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor( private http: HttpClient,
    private router: Router ) { }



  getClientes(): Observable <Cliente[]> {
    // return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndpoint).pipe(
      map(response => {
        let clientes = response as Cliente[]
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase()
          return cliente;
        })
      })
    );
  }

  create( cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente, {headers: this.httpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente ),
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id:any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire('Error al eliminar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }



}
