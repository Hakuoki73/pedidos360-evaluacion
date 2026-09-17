# 🚀 Pedidos360 - Sistema Integrado (Frontend Angular & Backend BFF Spring Boot)

Sistema de gestión y consulta de pedidos desarrollado para la evaluación de integración de servicios y seguridad, conectando un frontend en **Angular 18** con un Backend for Frontend (BFF) en **Spring Boot 3.3.4**, autenticado mediante **Microsoft Entra External ID (Azure CIAM)** con OAuth2/JWT.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** Angular (Standalone Components, Signals), MSAL Angular (`@azure/msal-angular`).
*   **Backend (BFF):** Java 21, Spring Boot 3.3.4, Spring Security 6, OAuth2 Resource Server (Nimbus).
*   **Seguridad / Auth:** Azure CIAM (Microsoft Entra External ID) mediante protocolo OAuth2 / OIDC con validación por JWK Set URI.

---

## 📂 Estructura del Repositorio

El repositorio contiene ambos componentes del sistema:
*   `pedidos360-bff/` -> Servidor Backend en Spring Boot.
*   `src/` (en la raíz o carpeta frontend) -> Aplicación cliente en Angular.

---

## ⚙️ Instrucciones de Configuración y Ejecución

Sigue estos pasos en orden para levantar el sistema completo en tu entorno local.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Hakuoki73/pedidos360-evaluacion.git](https://github.com/Hakuoki73/pedidos360-evaluacion.git)
cd pedidos360-evaluacion