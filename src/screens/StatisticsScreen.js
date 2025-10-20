import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuiz } from '../context/QuizContext';

export default function StatisticsScreen() {
  const { getGlobalStats, stats, questions, resetStats } = useQuiz();

  const globalStats = getGlobalStats();

  const handleReset = () => {
    Alert.alert(
      'Resetear Estadísticas',
      '¿Estás seguro de que quieres borrar todas tus estadísticas? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: () => {
            resetStats();
            Alert.alert('Completado', 'Estadísticas reseteadas correctamente');
          },
        },
      ]
    );
  };

  // Calcular preguntas por categoría
  const categoryStats = {};
  questions.forEach((q) => {
    if (!categoryStats[q.block]) {
      categoryStats[q.block] = {
        total: 0,
        correct: 0,
        incorrect: 0,
      };
    }
    categoryStats[q.block].total += 1;

    const questionStats = stats[q.id];
    if (questionStats) {
      categoryStats[q.block].correct += questionStats.correct;
      categoryStats[q.block].incorrect += questionStats.incorrect;
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Global Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas Globales</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total de Preguntas:</Text>
            <Text style={styles.statValue}>{globalStats.totalQuestions}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Preguntas Respondidas:</Text>
            <Text style={styles.statValue}>{globalStats.answeredQuestions}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total de Intentos:</Text>
            <Text style={styles.statValue}>{globalStats.totalAttempts}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Respuestas Correctas:</Text>
            <Text style={[styles.statValue, styles.correctText]}>
              {globalStats.totalCorrect}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Respuestas Incorrectas:</Text>
            <Text style={[styles.statValue, styles.incorrectText]}>
              {globalStats.totalIncorrect}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.accuracyContainer}>
            <Text style={styles.accuracyLabel}>Precisión Total</Text>
            <Text style={styles.accuracyValue}>{globalStats.accuracy}%</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${globalStats.accuracy}%` },
              ]}
            />
          </View>
        </View>

        {/* Category Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas por Bloque</Text>

          {Object.entries(categoryStats).map(([category, data]) => {
            const totalAttempts = data.correct + data.incorrect;
            const accuracy =
              totalAttempts > 0
                ? ((data.correct / totalAttempts) * 100).toFixed(1)
                : 0;

            return (
              <View key={category} style={styles.categoryItem}>
                <Text style={styles.categoryName}>{category}</Text>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryStatText}>
                    {data.total} preguntas
                  </Text>
                  {totalAttempts > 0 && (
                    <>
                      <Text style={styles.categoryStatText}>
                        ✅ {data.correct} | ❌ {data.incorrect}
                      </Text>
                      <Text style={[styles.categoryStatText, styles.accuracyText]}>
                        {accuracy}% precisión
                      </Text>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Resetear Estadísticas</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Las estadísticas se guardan localmente en tu dispositivo
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
  content: {
    padding: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  correctText: {
    color: '#27ae60',
  },
  incorrectText: {
    color: '#e74c3c',
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 15,
  },
  accuracyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  accuracyLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  accuracyValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 6,
  },
  categoryItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  categoryStats: {
    marginLeft: 10,
  },
  categoryStatText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  accuracyText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 20,
  },
});
