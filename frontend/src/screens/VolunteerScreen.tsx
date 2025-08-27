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
import { volunteerAPI } from '../services/api';
import { VolunteerOpportunity } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const VolunteerScreen: React.FC = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await volunteerAPI.getAll();
      setOpportunities(response.data || []);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch volunteer opportunities'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOpportunities();
    setRefreshing(false);
  };

  const handleRegisterForVolunteer = async (opportunityId: string) => {
    try {
      await volunteerAPI.register(opportunityId);
      Alert.alert('Success', 'You have registered for this volunteer opportunity!');
      // Refresh the opportunities list
      fetchOpportunities();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to register for volunteer opportunity'
      );
    }
  };

  const renderOpportunityItem = ({ item }: { item: VolunteerOpportunity }) => (
    <View style={styles.opportunityCard}>
      <View style={styles.opportunityHeader}>
        <Text style={styles.opportunityTitle}>{item.title}</Text>
        <Text style={styles.opportunityDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.opportunityDescription}>{item.description}</Text>
      
      <View style={styles.opportunityDetails}>
        <Text style={styles.opportunityLocation}>📍 {item.location}</Text>
        <Text style={styles.opportunityDuration}>⏱️ {item.duration}</Text>
      </View>
      
      {item.requiredSkills && item.requiredSkills.length > 0 && (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Required Skills:</Text>
          <View style={styles.skillsList}>
            {item.requiredSkills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.opportunityFooter}>
        <Text style={styles.volunteersCount}>
          {item.volunteers?.length || 0} volunteers
        </Text>
        
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegisterForVolunteer(item._id)}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Volunteer Opportunities</Text>
        <Text style={styles.headerSubtitle}>
          Make a difference in your community
        </Text>
      </View>

      <FlatList
        data={opportunities}
        renderItem={renderOpportunityItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No volunteer opportunities available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new opportunities
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
  opportunityCard: {
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
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  opportunityDate: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  opportunityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  opportunityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  opportunityLocation: {
    fontSize: 14,
    color: '#666',
  },
  opportunityDuration: {
    fontSize: 14,
    color: '#666',
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  opportunityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volunteersCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
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

export default VolunteerScreen;

