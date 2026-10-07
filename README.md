# Generador genérico para Vercel

Proyecto de demostración que permite escribir un dato, generar una URL única y mostrar ese dato en `/documento/<token>`.

## Deploy

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. En **Settings → Environment Variables**, crea:

   `TOKEN_SECRET` = una cadena larga y aleatoria.

4. Haz Redeploy.
5. Abre la URL principal, escribe un dato y pulsa **Generar**.

## Importante

El token contiene el dato cifrado con AES-256-GCM, por lo que no depende de una base de datos. Mantén `TOKEN_SECRET` sin cambios si quieres que las URLs anteriores sigan funcionando. Si cambias el secreto, los tokens anteriores dejarán de poder descifrarse.

Esta plantilla es deliberadamente genérica y no imita ni valida documentos oficiales.
