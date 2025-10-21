# Quiz App - Módulos de Inversión

Aplicación web interactiva de quiz diseñada para estudiar y practicar preguntas de los módulos de inversión: Renta Variable, Renta Fija y Materias Primas.

## 📖 Descripción

Esta aplicación permite estudiar de forma efectiva mediante un sistema inteligente de preguntas que se adapta al rendimiento del usuario. Las preguntas se organizan por módulos y bloques temáticos, permitiendo un estudio enfocado y estructurado.

## ✨ Características Principales

### Sistema Inteligente de Aprendizaje
- **Algoritmo Adaptativo**: Prioriza automáticamente las preguntas no respondidas y aquellas con mayor tasa de fallos
- **Peso por Frecuencia**: Las preguntas vistas menos veces tienen mayor probabilidad de aparecer
- **Aprendizaje Reforzado**: El sistema enfoca el estudio en las áreas con más dificultad

### Gestión de Módulos
- **3 Módulos Completos**: Renta Variable (60 preguntas), Renta Fija (60 preguntas) y Materias Primas (78 preguntas)
- **Estadísticas Independientes**: Cada módulo mantiene sus propias estadísticas y progreso
- **Cambio Rápido**: Selector de módulos accesible desde la pantalla principal

### Modos de Estudio
- **Modo Quiz**: Preguntas aleatorias ponderadas según el algoritmo inteligente
- **Repaso de Fallos**: Practica exclusivamente las preguntas respondidas incorrectamente
- **Revisión por Bloques**: Estudia preguntas de bloques temáticos específicos (clickeable desde Estadísticas)
- **Preguntas Marcadas**: Marca preguntas difíciles para revisarlas posteriormente

### Estadísticas Detalladas
- **Resumen Global**: Total de preguntas respondidas, correctas, incorrectas, precisión y total de intentos
- **Estadísticas por Bloque**: Progreso y precisión individual para cada bloque temático
- **Historial por Pregunta**: Visualiza el historial de aciertos y fallos de cada pregunta
- **Reseteo de Datos**: Opción para reiniciar todas las estadísticas

### Marcadores y Navegación
- **Sistema de Marcadores**: Marca/desmarca preguntas con un click
- **Navegación Flexible**: Botones de anterior/siguiente en modo revisión
- **Validación de Respuestas**: Explicación detallada tras cada respuesta

### Progressive Web App (PWA)
- **Instalable**: Funciona como aplicación nativa en móviles y escritorio
- **Offline**: Una vez cargada, funciona sin conexión a internet
- **Persistencia Local**: Todos los datos se guardan automáticamente en el navegador

## 🎯 Contenido

### Módulo 4 - Renta Variable (60 preguntas)
Bloques temáticos sobre inversión en acciones, análisis fundamental, valoración de empresas, estrategias de inversión en renta variable.

### Módulo 5 - Renta Fija (60 preguntas)
Bloques sobre bonos, tipos de interés, curva de rendimientos, análisis de renta fija, estrategias de inversión en bonos.

### Módulo 6 - Materias Primas (78 preguntas)
13 bloques que cubren:
- Introducción a las materias primas
- Análisis de oferta y demanda
- El ciclo de capital
- Petróleo, gas, carbón y uranio
- Metales industriales y preciosos
- Commodities agrícolas y minoritarias
- Inversión value aplicada
- Formas de invertir y análisis de riesgos

## 🛠️ Tecnologías

- **React 19**: Biblioteca de interfaz de usuario
- **Vite**: Build tool y servidor de desarrollo
- **React Router**: Navegación entre pantallas
- **LocalStorage**: Persistencia de datos en el navegador
- **vite-plugin-pwa**: Progressive Web App capabilities
- **GitHub Actions**: CI/CD automático
- **GitHub Pages**: Hosting estático gratuito

## 🚀 Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/quizz-app.git
cd quizz-app/quiz

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (http://localhost:5173)
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
quizz-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── quiz/
│   ├── public/                 # Archivos estáticos
│   ├── src/
│   │   ├── context/
│   │   │   └── QuizContext.jsx # Estado global y lógica
│   │   ├── data/
│   │   │   ├── modulo4.json    # Datos Módulo 4
│   │   │   ├── modulo5.json    # Datos Módulo 5
│   │   │   └── modulo6.json    # Datos Módulo 6
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx  # Pantalla principal
│   │   │   ├── QuizScreen.jsx  # Pantalla de quiz
│   │   │   ├── ReviewScreen.jsx # Repaso y bloques
│   │   │   └── StatisticsScreen.jsx # Estadísticas
│   │   ├── App.jsx             # Componente principal
│   │   └── main.jsx            # Punto de entrada
│   ├── vite.config.js          # Configuración Vite
│   └── package.json
└── README.md
```

## 🎨 Diseño Responsive

La aplicación está optimizada para todos los tamaños de pantalla:
- **Mobile**: 320px - 767px (diseño vertical)
- **Tablet**: 768px - 1023px (grid adaptativo)
- **Desktop**: 1024px+ (layout de dos columnas)

Utiliza breakpoints modernos y unidades clamp() para tipografía fluida.

## 🔄 Despliegue Automático

El proyecto incluye un workflow de GitHub Actions que:
1. Se ejecuta automáticamente en cada push a `main`
2. Instala dependencias
3. Construye la aplicación
4. Despliega a GitHub Pages
5. Tiempo estimado: 2-3 minutos

## 📝 Formato de Datos

Cada pregunta sigue esta estructura:

```json
{
  "id": "m4-1",
  "block": "BLOQUE I: Nombre del bloque",
  "question": "Texto de la pregunta",
  "options": [
    "Opción A",
    "Opción B",
    "Opción C",
    "Opción D"
  ],
  "correctAnswer": 2,
  "explanation": "Explicación detallada de la respuesta correcta"
}
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
