# ✅ Quiz App - Lista para Usar

## 🎉 La aplicación está 100% completa

Todas las dependencias están instaladas y el código está listo para ejecutar.

## 🚀 Ejecutar la Aplicación

### Opción 1: Desde tu terminal actual

```bash
cd /home/ana/git/quizz-app
npm start
```

Espera a que aparezca el **código QR** (puede tardar 1-2 minutos la primera vez).

### Opción 2: En una nueva terminal

1. Abre una nueva terminal
2. Navega al proyecto:
   ```bash
   cd /home/ana/git/quizz-app
   ```
3. Ejecuta:
   ```bash
   npm start
   ```

## 📱 En tu teléfono Android

1. **Instala Expo Go** desde Google Play Store
2. **Abre Expo Go**
3. **Toca "Scan QR Code"**
4. **Escanea el QR** que aparece en tu terminal
5. **¡La app se cargará automáticamente!**

## ✨ Funcionalidades

### Pantalla Principal
- Ver estadísticas de progreso
- Acceder a todas las funciones

### Practicar
- Preguntas aleatorias inteligentes
- El sistema prioriza preguntas que has fallado
- Marca preguntas difíciles con ⭐

### Repasar Fallos
- Solo preguntas que has respondido incorrectamente
- Navega entre ellas secuencialmente

### Marcadas
- Revisa preguntas que marcaste como difíciles

### Estadísticas
- Precisión global
- Estadísticas por bloque
- Resetear todos los datos

## 🔧 Características Técnicas

✅ **48 preguntas** del Módulo 4
✅ **Sistema inteligente** de priorización
✅ **Persistencia local** - Se guarda todo
✅ **Diseño minimalista** en español
✅ **Feedback visual** inmediato
✅ **Explicaciones** detalladas

## 📊 Cómo Funciona el Sistema Inteligente

El algoritmo calcula un "peso" para cada pregunta:

- **Preguntas nunca respondidas**: Peso estándar
- **Preguntas con más fallos**: Mayor probabilidad de aparecer
- **Preguntas dominadas**: Menor probabilidad

Esto te ayuda a enfocarte en las áreas donde necesitas más práctica.

## 🗂️ Estructura de Archivos

```
quizz-app/
├── data/
│   └── modulo4.json          # 48 preguntas
├── src/
│   ├── context/
│   │   └── QuizContext.js    # Lógica y estado
│   └── screens/
│       ├── HomeScreen.js     # Pantalla principal
│       ├── QuizScreen.js     # Quiz interactivo
│       ├── StatisticsScreen.js
│       └── ReviewScreen.js
├── App.js                     # Punto de entrada
├── package.json
└── README.md
```

## 📝 Agregar Más Módulos (Futuro)

Para agregar preguntas de otros módulos:

1. Crea `data/modulo5.json` con el mismo formato
2. Edita `src/context/QuizContext.js`
3. Importa el nuevo módulo

## ⚠️ Notas Importantes

- La advertencia sobre `react-native-safe-area-context` **no afecta** la funcionalidad
- Los datos se guardan **localmente** en tu dispositivo
- La app funciona **offline** una vez cargada
- Puedes resetear estadísticas desde la pantalla de Estadísticas

## 🆘 Solución de Problemas

**Si el puerto 8081 está ocupado:**
```bash
killall node
npm start
```

**Si no aparece el código QR:**
- Espera 1-2 minutos (primera vez tarda más)
- Presiona `r` para recargar
- Presiona `?` para ver ayuda

**Si hay error de conexión:**
- Verifica que PC y teléfono estén en la misma red WiFi
- Revisa el firewall no bloquee el puerto 8081

## 💡 Tips de Uso

1. **Marca preguntas difíciles** con la estrella para repasarlas después
2. **Revisa las explicaciones** para entender cada concepto
3. **Usa el modo repaso** para enfocarte en tus áreas débiles
4. **Revisa estadísticas** regularmente para ver tu progreso

---

**¡Disfruta estudiando!** 📚✨

La aplicación está diseñada para ayudarte a dominar el Módulo 4 de forma eficiente.
