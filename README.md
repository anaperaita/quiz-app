# Quiz App - Módulo 4

Aplicación móvil de quiz para Android desarrollada con React Native y Expo.

## Características

- ✅ **Preguntas Aleatorias Inteligentes**: El sistema prioriza automáticamente las preguntas que has fallado más veces
- 📊 **Estadísticas Detalladas**: Seguimiento completo de tu progreso y rendimiento
- ⭐ **Marcadores**: Marca preguntas difíciles para repasar más tarde
- 🔄 **Modo Repaso**: Practica específicamente las preguntas que has fallado
- 💾 **Persistencia Local**: Todos tus datos se guardan automáticamente en el dispositivo
- 🎨 **Diseño Minimalista**: Interfaz limpia y fácil de usar

## Tecnologías Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage
- Context API

## Instalación

1. Asegúrate de tener Node.js instalado
2. Instala las dependencias:

```bash
npm install
```

## Ejecutar la Aplicación

### En Expo Go (Recomendado para desarrollo rápido)

```bash
npm start
```

Luego escanea el código QR con la app Expo Go en tu teléfono Android.

### En Android Emulator

```bash
npm run android
```

### En iOS Simulator (solo macOS)

```bash
npm run ios
```

## Estructura del Proyecto

```
quizz-app/
├── data/
│   └── modulo4.json        # Preguntas del módulo 4
├── src/
│   ├── context/
│   │   └── QuizContext.js  # Estado global y lógica
│   └── screens/
│       ├── HomeScreen.js   # Pantalla principal
│       ├── QuizScreen.js   # Pantalla de quiz
│       ├── StatisticsScreen.js
│       └── ReviewScreen.js
├── App.js
└── package.json
```

## Agregar Nuevos Módulos

Para agregar preguntas de otros módulos:

1. Crea un nuevo archivo JSON en la carpeta `data/` (ejemplo: `modulo5.json`)
2. Sigue el mismo formato que `modulo4.json`:

```json
{
  "module": "Módulo 5",
  "title": "Título del módulo",
  "totalQuestions": 50,
  "questions": [
    {
      "id": "m5-1",
      "block": "Nombre del bloque",
      "question": "Texto de la pregunta",
      "options": [
        "Opción A",
        "Opción B",
        "Opción C",
        "Opción D"
      ],
      "correctAnswer": 2,
      "explanation": "Explicación de la respuesta correcta"
    }
  ]
}
```

3. Importa y agrega el módulo en `src/context/QuizContext.js`

## Formato de las Preguntas

- **id**: Identificador único (ej: "m4-1", "m4-2", etc.)
- **block**: Categoría o bloque temático
- **question**: Texto de la pregunta
- **options**: Array con 4 opciones de respuesta
- **correctAnswer**: Índice de la respuesta correcta (0-3)
- **explanation**: Explicación que se muestra después de responder

## Funcionalidades

### Sistema Inteligente de Preguntas
El algoritmo calcula un "peso" para cada pregunta basado en:
- Preguntas nunca respondidas tienen peso estándar
- Preguntas con más fallos tienen mayor probabilidad de aparecer
- Esto ayuda a reforzar el aprendizaje en áreas débiles

### Estadísticas
- Total de preguntas respondidas
- Precisión global
- Estadísticas por bloque/categoría
- Historial de intentos por pregunta

### Marcadores
- Marca preguntas difíciles para revisarlas más tarde
- Acceso rápido desde la pantalla principal

### Modo Repaso
- Practica solo las preguntas que has fallado
- Revisa preguntas marcadas
- Navegación secuencial entre preguntas

## Resetear Datos

Puedes resetear todas las estadísticas desde la pantalla de Estadísticas. Esta acción no se puede deshacer.

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo.
