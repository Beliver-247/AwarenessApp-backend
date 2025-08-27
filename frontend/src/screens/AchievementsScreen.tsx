import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { achievementsAPI } from '../services/api';
import { Achievement } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AchievementsScreen: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [achievementsResponse, leaderboardResponse] = await Promise.all([
        achievementsAPI.getAll(),
        achievementsAPI.getLeaderboard(),
      ]);
      
      setAchievements(achievementsResponse.data || []);
      setLeaderboard(leaderboardResponse.data || []);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch data'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderAchievementItem = ({ item, index }: { item: Achievement; index: number }) => (
    <View style={styles.achievementCard}>
      <View style={styles.achievementHeader}>
        <View style={styles.achievementIcon}>
          <Text style={styles.achievementIconText}>
            {item.icon || '🏆'}
          </Text>
        </View>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.leaderboardCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>
          {index + 1 <= 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || 'Anonymous'}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{item.totalPoints || 0} pts</Text>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements & Leaderboard</Text>
        <Text style={styles.headerSubtitle}>
          Track your progress and compete with others
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'achievements' ? (
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No achievements available</Text>
              <Text style={styles.emptySubtext}>
                Complete challenges to earn achievements
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No leaderboard data available</Text>
              <Text style={styles.emptySubtext}>
                Start participating to see rankings
              </Text>
            </View>
          }
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
  },
  achievementCard: {
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
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pointsContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  leaderboardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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

export default AchievementsScreen;

