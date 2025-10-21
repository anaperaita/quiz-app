# Quiz App - Módulos de Inversión

Una aplicación web de quiz inteligente para estudiar los módulos de inversión (Renta Variable, Renta Fija, y Materias Primas).

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Pasos para publicar:

1. **Crear un repositorio en GitHub** (si no existe):
   - Ve a https://github.com/new
   - Nombre del repositorio: `quizz-app`
   - Haz el repositorio público o privado (ambos funcionan con GitHub Pages)
   - NO inicialices con README (ya tienes uno)

2. **Conectar el repositorio local con GitHub**:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/quizz-app.git
   ```

3. **Push al repositorio**:
   ```bash
   git push -u origin main
   ```

4. **Configurar GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Click en "Settings" (Configuración)
   - En el menú lateral, click en "Pages"
   - En "Source", selecciona "GitHub Actions"
   - ¡Listo! El workflow se ejecutará automáticamente

5. **Esperar el despliegue**:
   - Ve a la pestaña "Actions" en tu repositorio
   - Verás el workflow "Deploy to GitHub Pages" ejecutándose
   - Cuando termine (⚠️ tarda ~2-3 minutos), tu app estará disponible en:
   ```
   https://TU-USUARIO.github.io/quizz-app/
   ```

### Actualizaciones automáticas

Cada vez que hagas `git push` a la rama `main`, la aplicación se desplegará automáticamente.

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
cd quiz
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build de producción
npm run preview
```

## 📱 Características

- ✅ 3 módulos: Renta Variable, Renta Fija, y Materias Primas
- ✅ Sistema de estadísticas por módulo
- ✅ Modo de repaso de preguntas incorrectas
- ✅ Marcado de preguntas importantes
- ✅ Revisión por bloques temáticos
- ✅ Algoritmo inteligente que prioriza preguntas no vistas o falladas
- ✅ PWA - Funciona offline una vez cargada

## 🎯 Tecnologías

- React 19
- Vite
- React Router
- LocalStorage para persistencia
- GitHub Actions para CI/CD
- GitHub Pages para hosting

## 📊 Contenido

- **Módulo 4**: Renta Variable (60 preguntas)
- **Módulo 5**: Renta Fija (60 preguntas)
- **Módulo 6**: Materias Primas (78 preguntas)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
