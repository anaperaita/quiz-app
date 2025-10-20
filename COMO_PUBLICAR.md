# 📱 Cómo Publicar tu App Quiz

## Opciones de Publicación

### **Opción 1: EAS Build (Recomendado) - APK/AAB Profesional**

Esta es la forma oficial de Expo para crear builds de producción.

#### Paso 1: Configurar EAS

```bash
# Ya instalado: eas-cli
# Ahora configura tu proyecto
eas login
```

Te pedirá crear una cuenta en Expo o iniciar sesión.

#### Paso 2: Configurar el Build

```bash
eas build:configure
```

Esto creará un archivo `eas.json` en tu proyecto.

#### Paso 3: Construir APK (para distribución directa)

```bash
# Build para Android (APK para instalar directamente)
eas build -p android --profile preview
```

**O para Google Play Store (AAB):**

```bash
eas build -p android --profile production
```

**Tiempo estimado**: 10-20 minutos (build en la nube)

#### Paso 4: Descargar el APK

Una vez terminado el build, recibirás un link para descargar el APK.

**Puedes:**
- ✅ Instalar directamente en tu teléfono
- ✅ Compartir con otros usuarios
- ✅ Subir a Google Play Store

---

### **Opción 2: Expo Publish (Para compartir vía Expo Go)**

La forma más rápida para compartir con otros usuarios que tengan Expo Go:

```bash
npx expo publish
```

Obtendrás un link como: `exp://exp.host/@tu-usuario/quizz-app`

**Ventajas:**
- ✅ Instantáneo (segundos)
- ✅ Fácil de compartir

**Desventajas:**
- ❌ Requiere Expo Go instalado
- ❌ No es una app standalone

---

### **Opción 3: Build Local (Avanzado)**

Si quieres construir localmente sin usar la nube:

```bash
# Requiere Android Studio instalado
npx expo run:android
```

---

## 🎯 Recomendación: EAS Build

Para tu caso, **recomiendo EAS Build** porque:

1. ✅ Genera un APK instalable directamente
2. ✅ No requiere configuración compleja
3. ✅ Funciona sin tener Android Studio
4. ✅ Es gratuito para builds básicos

---

## 📋 Pasos Detallados con EAS

### 1. Crear cuenta en Expo

```bash
eas login
```

Si no tienes cuenta, crea una en: https://expo.dev/signup

### 2. Configurar el proyecto

```bash
eas build:configure
```

Selecciona:
- Platform: **Android**
- Build type: **APK** (para distribución directa)

### 3. Actualizar información de la app (Opcional)

Edita `app.json`:

```json
{
  "expo": {
    "name": "Quiz Módulo 4",
    "version": "1.0.0",
    "android": {
      "package": "com.tuempresa.quizmodulo4",
      "versionCode": 1
    }
  }
}
```

### 4. Construir el APK

```bash
# APK para distribución directa (no Google Play)
eas build -p android --profile preview

# O AAB para Google Play Store
eas build -p android --profile production
```

### 5. Esperar el build

El proceso tarda **10-20 minutos**. Puedes:
- Ver el progreso en la terminal
- Revisar en https://expo.dev/accounts/tu-usuario/projects

### 6. Descargar e instalar

Cuando termine:
1. Recibirás un **link de descarga**
2. Descarga el APK en tu Android
3. Activa "Instalar apps desconocidas" en Configuración
4. Instala el APK
5. ¡Listo! App instalada

---

## 🏪 Para Google Play Store

Si quieres publicar en Google Play:

### 1. Crea una cuenta de desarrollador

- Costo: $25 USD (una sola vez)
- Registro: https://play.google.com/console

### 2. Genera el AAB

```bash
eas build -p android --profile production
```

### 3. Configura la firma de la app

```bash
eas credentials
```

Sigue las instrucciones para generar el keystore.

### 4. Sube a Google Play Console

1. Crea una nueva app
2. Sube el AAB generado
3. Completa la información (descripción, screenshots)
4. Envía para revisión

**Tiempo de revisión**: 1-7 días

---

## 📦 Configuración Adicional

### Icono de la App

Crea un icono PNG de **1024x1024px** y colócalo en:

```
assets/icon.png
```

Actualiza `app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

### Splash Screen

Crea una imagen de splash PNG y actualiza en `app.json`:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3498db"
    }
  }
}
```

---

## 🚀 Comandos Rápidos

```bash
# Login en Expo
eas login

# Configurar build
eas build:configure

# Build APK (distribución directa)
eas build -p android --profile preview

# Build AAB (Google Play)
eas build -p android --profile production

# Ver builds
eas build:list

# Publicar vía Expo (compartir con Expo Go)
npx expo publish
```

---

## 💡 Tips

1. **Primera vez**: Usa el perfil `preview` para generar un APK y probar
2. **Producción**: Usa el perfil `production` para Google Play
3. **Compartir rápido**: Usa `expo publish` para compartir vía link
4. **Actualizaciones**: Para actualizar la app, incrementa el `versionCode` en `app.json`

---

## ⚡ Inicio Rápido (Lo Más Fácil)

```bash
# 1. Login
eas login

# 2. Configurar
eas build:configure

# 3. Build APK
eas build -p android --profile preview

# 4. Esperar 10-20 minutos

# 5. Descargar el APK del link que te dan

# 6. Instalar en tu teléfono
```

---

## 🆘 Solución de Problemas

**Error: No credentials configured**
```bash
eas credentials
```

**Error: Build failed**
- Revisa los logs en https://expo.dev
- Asegúrate que `app.json` esté bien configurado

**APK muy grande**
- Considera usar AAB (se optimiza automáticamente)
- Revisa dependencias innecesarias

---

¿Quieres que te ayude a ejecutar alguno de estos pasos?
