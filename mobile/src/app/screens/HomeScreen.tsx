import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { aiService } from '../services/api';
// Using Lucide Icons (Lucide normally needs to be installed)
// import { Sparkles, Calendar, CheckCircle, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await aiService.getSuggestions();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await aiService.checkHealth();
      setApiStatus(res.status === 'healthy' ? 'Connected' : 'Offline');
    } catch (error) {
      setApiStatus('Error Connection');
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={Typography.title}>Hi, Productive User! ✨</Text>
          <Text style={Typography.caption}>Let's make today count.</Text>
        </View>

        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
             {/* <Sparkles size={20} color={Colors.light.primary} /> */}
             <Text style={[Typography.title, { marginLeft: 8 }]}>AI Suggestion</Text>
          </View>
          {loading ? (
            <ActivityIndicator color={Colors.light.primary} style={{ marginVertical: 10 }} />
          ) : (
            suggestions.map((item, index) => (
              <View key={index} style={styles.suggestionItem}>
                <View style={styles.bullet} />
                <Text style={Typography.body}>{item}</Text>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.refreshButton} onPress={fetchSuggestions}>
            <Text style={styles.refreshText}>Get New Insights</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.section}>
          <Text style={Typography.title}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={checkStatus}>
              <Text style={styles.actionLabel}>Check API</Text>
              {apiStatus && <Text style={styles.statusLabel}>{apiStatus}</Text>}
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  aiCard: {
    marginBottom: Spacing.xl,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginRight: 10,
  },
  refreshButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    padding: Spacing.sm,
  },
  refreshText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  section: {
    marginTop: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  actionButton: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 120,
    alignItems: 'center',
    ...Shadows.soft,
  },
  actionLabel: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusLabel: {
    fontSize: 10,
    color: Colors.light.accent,
    marginTop: 4,
  }
});
