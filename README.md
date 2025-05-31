# Gestor de Archivos con Supabase e Ionic

Este proyecto es una aplicación móvil desarrollada con Ionic y Angular que permite a los usuarios autenticarse y gestionar archivos utilizando Supabase como backend.

## Características Principales

*   Autenticación de usuarios (registro e inicio de sesión) a través de Supabase Auth.
*   Carga de archivos a Supabase Storage.
*   Almacenamiento de metadatos de archivos en una tabla de Supabase.
*   Interfaz de usuario intuitiva construida con componentes Ionic.

## Tecnologías Utilizadas

*   **Ionic Framework**: Framework para construir aplicaciones móviles multiplataforma.
*   **Angular**: Plataforma para construir aplicaciones web y móviles.
*   **Supabase**: Plataforma de backend como servicio (BaaS) que proporciona:
    *   **Supabase Auth**: Para la autenticación de usuarios.
    *   **Supabase Storage**: Para el almacenamiento de archivos.
    *   **Supabase Database**: Para almacenar información de los archivos.
*   **TypeScript**: Superset de JavaScript que añade tipado estático.
*   **Capacitor**: Para empaquetar la aplicación web como una aplicación nativa.

## Prerrequisitos

*   Node.js y npm (o Yarn) instalados.
*   Ionic CLI instalado (`npm install -g @ionic/cli`).
*   Una cuenta de Supabase.

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-directorio-del-proyecto>
    ```
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

## Configuración

### Configuración de Supabase

1.  Crea un nuevo proyecto en [Supabase](https://supabase.com/).
2.  Dentro de tu proyecto de Supabase:
    *   Ve a la sección de **Authentication** -> **Providers** y asegúrate de que el proveedor de Email esté habilitado. Puedes configurar otras opciones de autenticación si lo deseas.
    *   Ve a la sección de **Storage** y crea un nuevo bucket. Por defecto, el proyecto utiliza un bucket llamado `uploads` (como se define en [`src/app/pages/files/files.page.ts`](src/app/pages/files/files.page.ts)). Asegúrate de que las políticas de acceso al bucket sean las adecuadas para tu aplicación (por ejemplo, permitir la subida de archivos a usuarios autenticados).
    *   Ve a la sección de **SQL Editor** y crea una tabla para almacenar la información de los archivos. Puedes usar un script SQL similar al siguiente (ajusta los campos según tus necesidades):
        ```sql
        CREATE TABLE files (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id),
          file_name TEXT,
          file_url TEXT,
          file_type TEXT,
          file_size BIGINT,
          bucket_name TEXT,
          uploaded_at TIMESTAMPTZ DEFAULT NOW()
        );
        ```
        Asegúrate de habilitar RLS (Row Level Security) en esta tabla y definir las políticas adecuadas para permitir a los usuarios autenticados insertar y leer sus propios archivos.
3.  Obtén la URL de tu API de Supabase y la clave `anon` (anónima pública).
    *   Ve a **Project Settings** -> **API**.
4.  Actualiza las credenciales de Supabase en tu proyecto Ionic:
    *   Modifica el archivo environment.ts y environment.prod.ts para producción con tu URL de Supabase y tu clave anon`:
        ```typescript
        // filepath: src\environments\environment.ts
        export const environment = {
          production: false,
          supaUrl: 'TU_SUPABASE_URL', // Reemplaza con tu URL de Supabase
          supaKey: 'TU_SUPABASE_ANON_KEY', // Reemplaza con tu clave anónima de Supabase
        };
        ```
    *   Asegúrate de que el cliente de Supabase en [`src/app/supabase.client.ts`](src/app/supabase.client.ts) esté utilizando estas variables de entorno.

## Ejecución del Proyecto

### En el navegador (para desarrollo)

```bash
ionic serve
```

### En un dispositivo o emulador (Android)

1.  Añade la plataforma Android:
    ```bash
    ionic capacitor add android
    ```
2.  Sincroniza los cambios:
    ```bash
    ionic capacitor sync android
    ```
3.  Abre el proyecto en Android Studio:
    ```bash
    ionic capacitor open android
    ```
4.  Desde Android Studio, ejecuta la aplicación en un emulador o dispositivo conectado.

## Estructura del Proyecto (Resumen)

*   `src/app/`: Contiene la lógica principal de la aplicación Angular.
    *   `src/app/home/`: Página de autenticación ([`home.page.ts`](src/app/home/home.page.ts), [`home.page.html`](src/app/home/home.page.html)).
    *   `src/app/pages/files/`: Página para la subida y gestión de archivos ([`files.page.ts`](src/app/pages/files/files.page.ts), [`files.page.html`](src/app/pages/files/files.page.html)).
    *   `src/app/services/uploadfiles.service.ts`: Servicio para interactuar con Supabase Storage y la base de datos.
    *   `src/app/supabase.client.ts`: Configuración del cliente de Supabase.
*   `src/environments/`: Archivos de configuración del entorno.
*   `android/`: Proyecto nativo de Android generado por Capacitor.
*   `www/`: Carpeta donde se compila la aplicación web para ser desplegada o empaquetada por Capacitor.

## Capturas de Pantalla

<!-- Deja espacio aquí para añadir capturas de pantalla de la aplicación en funcionamiento -->

### Página de Autenticación
![Página de Autenticación](https://github.com/user-attachments/assets/96040345-4fd4-4fe4-88ed-80365f04f8d2)


### Página de Subida de Archivos
![Página de Subida de Archivos](https://github.com/user-attachments/assets/ee30e1d4-f646-44aa-ab13-03f60291d4a3)


### Archivo Subido
![Archivo Subido](https://github.com/user-attachments/assets/5c877864-97db-43cb-8acc-433ac1c80104)


