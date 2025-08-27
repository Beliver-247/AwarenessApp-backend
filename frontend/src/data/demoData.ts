import { Event, Challenge, VolunteerOpportunity, Achievement } from '../types';

export const demoEvents: Event[] = [
  {
    _id: '1',
    title: 'Community Cleanup Day',
    description: 'Join us for a day of cleaning up our local park and making it beautiful for everyone to enjoy.',
    date: '2024-02-15T09:00:00Z',
    location: 'Central Park',
    maxParticipants: 50,
    currentParticipants: 23,
  },
  {
    _id: '2',
    title: 'Food Drive for Homeless',
    description: 'Help collect and distribute food to those in need in our community.',
    date: '2024-02-20T10:00:00Z',
    location: 'Community Center',
    maxParticipants: 30,
    currentParticipants: 15,
  },
  {
    _id: '3',
    title: 'Senior Citizen Tech Help',
    description: 'Teach senior citizens how to use smartphones and computers.',
    date: '2024-02-25T14:00:00Z',
    location: 'Senior Center',
    maxParticipants: 20,
    currentParticipants: 8,
  },
];

export const demoChallenges: Challenge[] = [
  {
    _id: '1',
    title: '30-Day Fitness Challenge',
    description: 'Complete 30 days of consistent exercise and healthy eating.',
    points: 100,
    deadline: '2024-03-15T23:59:59Z',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    _id: '2',
    title: 'Read 5 Books This Month',
    description: 'Read 5 books and share your thoughts with the community.',
    points: 75,
    deadline: '2024-02-29T23:59:59Z',
    participants: ['user1', 'user4'],
  },
  {
    _id: '3',
    title: 'Learn a New Skill',
    description: 'Learn a completely new skill and document your progress.',
    points: 150,
    deadline: '2024-04-01T23:59:59Z',
    participants: ['user2', 'user5'],
  },
];

export const demoVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    _id: '1',
    title: 'Animal Shelter Helper',
    description: 'Help care for animals at the local animal shelter. Duties include feeding, cleaning, and socializing with animals.',
    location: 'Happy Paws Animal Shelter',
    date: '2024-02-18T08:00:00Z',
    duration: '4 hours',
    requiredSkills: ['Animal care', 'Patience', 'Physical stamina'],
    volunteers: ['user1', 'user3'],
  },
  {
    _id: '2',
    title: 'Library Reading Program',
    description: 'Read books to children at the public library to promote literacy and love for reading.',
    location: 'Public Library',
    date: '2024-02-22T15:00:00Z',
    duration: '2 hours',
    requiredSkills: ['Reading', 'Patience with children', 'Clear speech'],
    volunteers: ['user2'],
  },
  {
    _id: '3',
    title: 'Community Garden Maintenance',
    description: 'Help maintain the community garden by watering plants, weeding, and harvesting vegetables.',
    location: 'Community Garden',
    date: '2024-02-24T09:00:00Z',
    duration: '3 hours',
    requiredSkills: ['Basic gardening', 'Physical work'],
    volunteers: ['user1', 'user4', 'user5'],
  },
];

export const demoAchievements: Achievement[] = [
  {
    _id: '1',
    title: 'First Steps',
    description: 'Complete your first community event or challenge.',
    points: 25,
    icon: '🌟',
  },
  {
    _id: '2',
    title: 'Helping Hand',
    description: 'Volunteer for 5 different opportunities.',
    points: 50,
    icon: '🤝',
  },
  {
    _id: '3',
    title: 'Challenge Master',
    description: 'Complete 10 challenges successfully.',
    points: 100,
    icon: '🏆',
  },
  {
    _id: '4',
    title: 'Community Leader',
    description: 'Organize and lead a community event.',
    points: 200,
    icon: '👑',
  },
];

export const demoLeaderboard = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    totalPoints: 450,
  },
  {
    _id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    totalPoints: 380,
  },
  {
    _id: 'user3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    totalPoints: 320,
  },
  {
    _id: 'user4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    totalPoints: 280,
  },
  {
    _id: 'user5',
    name: 'David Brown',
    email: 'david@example.com',
    totalPoints: 220,
  },
];

