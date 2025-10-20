# Cómo Ejecutar la Aplicación Quiz

## ✅ La aplicación está completa y lista para usar

### 📋 Paso a Paso:

**1. Abre una terminal en el directorio del proyecto:**
```bash
cd /home/ana/git/quizz-app
```

**2. Ejecuta el servidor de desarrollo:**
```bash
npm start
```

**3. Espera a que aparezca el código QR en la terminal**
- Puede tardar 1-2 minutos la primera vez (reconstruye el cache)
- Verás un código QR grande en la terminal
- También verás una URL como `exp://192.168.x.x:8081`

**4. En tu teléfono Android:**
- Instala **Expo Go** desde Google Play Store
- Abre la app Expo Go
- Toca "Scan QR Code"
- Escanea el código QR que aparece en tu terminal
- ¡La app se cargará en tu teléfono!

### 🔧 Si tienes problemas:

**Problema: El puerto 8081 ya está en uso**
```bash
# Mata los procesos anteriores
killall node
# Luego vuelve a ejecutar
npm start
```

**Problema: No aparece el código QR**
- Presiona `r` para recargar
- Presiona `w` para abrir en web (para probar)
- Presiona `?` para ver ayuda

**Problema: Error de conexión**
- Asegúrate de que tu PC y teléfono estén en la misma red WiFi
- Verifica que el firewall no esté bloqueando el puerto 8081

### 🎯 Funcionalidades de la App:

Una vez cargada la app, verás:

1. **Pantalla Principal (Home)**
   - Estadísticas de tu progreso
   - Botón "Practicar" - preguntas aleatorias inteligentes
   - Botón "Repasar Fallos" - solo preguntas que has fallado
   - Botón "Marcadas" - preguntas que marcaste
   - Botón "Estadísticas" - ver rendimiento detallado

2. **Durante el Quiz**
   - Selecciona una respuesta (A, B, C, o D)
   - Presiona "Validar Respuesta"
   - Ver si es correcta ✅ o incorrecta ❌
   - Leer la explicación
   - Marcar como difícil con la estrella ⭐
   - Presiona "Siguiente Pregunta"

3. **Sistema Inteligente**
   - Las preguntas que fallas más veces aparecen con mayor frecuencia
   - Se guarda el historial de cada pregunta
   - Todo se guarda automáticamente en tu dispositivo

### 📊 Características:

- ✅ 48 preguntas del Módulo 4
- ✅ Algoritmo inteligente que prioriza preguntas falladas
- ✅ Persistencia de datos (se guarda todo)
- ✅ Estadísticas detalladas
- ✅ Marcadores para preguntas difíciles
- ✅ Modo repaso de fallos
- ✅ Diseño minimalista en español
- ✅ Explicaciones detalladas

### 🔄 Para Detener el Servidor:

En la terminal donde ejecutaste `npm start`, presiona:
```
Ctrl + C
```

### 📱 Para Agregar Más Módulos:

1. Crea un nuevo archivo JSON en `data/` (ejemplo: `modulo5.json`)
2. Sigue el mismo formato que `modulo4.json`
3. Importa el módulo en `src/context/QuizContext.js`
4. ¡Listo!

### 💡 Notas:

- La app funciona offline una vez cargada
- Los datos se guardan localmente (no se pierden al cerrar)
- Puedes resetear estadísticas desde la pantalla de Estadísticas
- El warning sobre `react-native-safe-area-context` no afecta la funcionalidad

---

**¿Necesitas ayuda?** Revisa el README.md para más información.
