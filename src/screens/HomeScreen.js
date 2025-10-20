import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useQuiz } from '../context/QuizContext';

export default function HomeScreen({ navigation }) {
  const {
    getGlobalStats,
    loading,
    bookmarks,
    getIncorrectQuestions,
    selectedModule,
    setSelectedModule,
    availableModules,
  } = useQuiz();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const globalStats = getGlobalStats();
  const incorrectCount = getIncorrectQuestions().length;
  const currentModule = availableModules.find(m => m.id === selectedModule);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Visual Quiz</Text>

        {/* Module Selector */}
        <View style={styles.moduleSelectorContainer}>
          <Text style={styles.moduleSelectorLabel}>Selecciona Módulo:</Text>
          <View style={styles.moduleButtons}>
            {availableModules.map(module => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleButton,
                  selectedModule === module.id && styles.moduleButtonActive,
                ]}
                onPress={() => setSelectedModule(module.id)}
              >
                <Text
                  style={[
                    styles.moduleButtonText,
                    selectedModule === module.id && styles.moduleButtonTextActive,
                  ]}
                >
                  {module.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu Progreso</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{globalStats.answeredQuestions}</Text>
              <Text style={styles.statLabel}>Respondidas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{globalStats.totalQuestions}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.accuracyValue]}>
                {globalStats.accuracy}%
              </Text>
              <Text style={styles.statLabel}>Precisión</Text>
            </View>
          </View>
        </View>

        {/* Main Actions */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.primaryButtonText}>📚 Practicar</Text>
          <Text style={styles.primaryButtonSubtext}>Preguntas aleatorias inteligentes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Review')}
          disabled={incorrectCount === 0}
        >
          <Text style={[styles.buttonText, incorrectCount === 0 && styles.disabledText]}>
            🔄 Repasar Fallos ({incorrectCount})
          </Text>
          <Text style={[styles.buttonSubtext, incorrectCount === 0 && styles.disabledText]}>
            {incorrectCount === 0
              ? 'No tienes preguntas falladas'
              : 'Practica tus preguntas difíciles'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Review', { bookmarked: true })}
          disabled={bookmarks.length === 0}
        >
          <Text style={[styles.buttonText, bookmarks.length === 0 && styles.disabledText]}>
            ⭐ Marcadas ({bookmarks.length})
          </Text>
          <Text style={[styles.buttonSubtext, bookmarks.length === 0 && styles.disabledText]}>
            {bookmarks.length === 0
              ? 'No has marcado preguntas'
              : 'Repasa preguntas marcadas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.statsButton]}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.statsButtonText}>📊 Estadísticas</Text>
          <Text style={styles.statsButtonSubtext}>Ver tu rendimiento detallado</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 El sistema prioriza automáticamente las preguntas que has fallado más veces
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  moduleSelectorContainer: {
    marginBottom: 25,
  },
  moduleSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  moduleButtons: {
    gap: 10,
  },
  moduleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  moduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  moduleButtonTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
  },
  accuracyValue: {
    color: '#27ae60',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  button: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#fff',
  },
  statsButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  statsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsButtonSubtext: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  disabledText: {
    color: '#bdc3c7',
  },
  infoCard: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 20,
  },
});
