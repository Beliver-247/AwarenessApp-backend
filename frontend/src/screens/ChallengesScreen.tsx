import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { challengesAPI } from '../services/api';
import { Challenge } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const ChallengesScreen: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await challengesAPI.getAll();
      setChallenges(response.data || []);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch challenges'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChallenges();
    setRefreshing(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await challengesAPI.join(challengeId);
      Alert.alert('Success', 'You have joined the challenge!');
      // Refresh the challenges list
      fetchChallenges();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to join challenge'
      );
    }
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>{item.description}</Text>
      
      <View style={styles.challengeDetails}>
        <Text style={styles.deadlineText}>
          ⏰ Deadline: {new Date(item.deadline).toLocaleDateString()}
        </Text>
        <Text style={styles.participantsText}>
          {item.participants?.length || 0} participants
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => handleJoinChallenge(item._id)}
      >
        <Text style={styles.joinButtonText}>Join Challenge</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Challenges</Text>
        <Text style={styles.headerSubtitle}>
          Take on challenges and earn points
        </Text>
      </View>

      <FlatList
        data={challenges}
        renderItem={renderChallengeItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No challenges available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new challenges
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  pointsContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 14,
    color: '#666',
  },
  participantsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChallengesScreen;

