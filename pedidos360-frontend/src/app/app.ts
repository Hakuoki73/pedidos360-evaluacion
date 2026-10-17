import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('Pedidos360');
  
  isIframe = false;
  isLoggedIn = false;
  userName = '';
  userRoles: string[] = [];
  pedidos: any[] = [];

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.verificarSesion();
  }

  verificarSesion() {
    const cuentas = this.msalService.instance.getAllAccounts();
    
    if (cuentas.length > 0) {
      const cuentaActiva = cuentas[0];
      this.msalService.instance.setActiveAccount(cuentaActiva);
      
      this.isLoggedIn = true;
      this.userName = cuentaActiva.name || cuentaActiva.username;
      
      if (cuentaActiva.idTokenClaims && cuentaActiva.idTokenClaims.roles) {
        this.userRoles = cuentaActiva.idTokenClaims.roles as string[];
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  login() {
    this.msalService.loginRedirect({
      scopes: ["d1a052a1-66c7-4847-b5e2-46fdb86c94f6/.default"]
    });
  }

  logout() {
    this.msalService.logoutRedirect();
  }
  
  obtenerPedidos() {
    const cuentaActiva = this.msalService.instance.getActiveAccount();
    
    if (!cuentaActiva) {
      alert('Debes iniciar sesión primero.');
      return;
    }

    this.msalService.acquireTokenSilent({
      scopes: ['d1a052a1-66c7-4847-b5e2-46fdb86c94f6/.default'],
      account: cuentaActiva
    }).subscribe({
      next: (response) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${response.accessToken}`,
          'Content-Type': 'application/json'
        });

        // Apunta directamente al API Gateway de AWS
        const urlAws = `${environment.apiUrl}/api/pedidos`;

        this.http.get<any[]>(urlAws, { headers }).subscribe({
          next: (data) => {
            this.pedidos = data;
            console.log('Pedidos recibidos desde AWS API Gateway:', data);
          },
          error: (error) => {
            console.error('Error al llamar al API Gateway de AWS:', error);
            alert('El servidor rechazó la petición. Revisa la consola o los logs de EC2.');
          }
        });
      },
      error: (err) => {
        console.error('Error al adquirir token silencioso:', err);
        this.msalService.loginRedirect();
      }
    });
  }
}