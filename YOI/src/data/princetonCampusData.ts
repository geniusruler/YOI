/**
 * Comprehensive Princeton University Campus Data
 * Complete building information for realistic 3D campus experience
 */

export interface Building {
  id: string;
  name: string;
  type: 'residential' | 'academic' | 'library' | 'dining' | 'cafe' | 'athletics' | 'administrative' | 'eating-club' | 'religious' | 'research';
  position: [number, number, number];
  size: [number, number, number]; // width, height, depth
  color: string;
  style: 'collegiate-gothic' | 'colonial' | 'modern' | 'victorian' | 'classical';
  description: string;
  amenities?: string[];
  capacity?: number;
  hasStudyRooms?: boolean;
  hasCafe?: boolean;
  hasDining?: boolean;
  openHours?: string;
}

// RESIDENTIAL COLLEGES
export const residentialColleges: Building[] = [
  {
    id: 'mathey',
    name: 'Mathey College',
    type: 'residential',
    position: [-40, 0, -30],
    size: [25, 15, 20],
    color: '#c9b899',
    style: 'collegiate-gothic',
    description: 'Residential college with Gothic architecture, home to freshmen and sophomores',
    amenities: ['Dining Hall', 'Common Room', 'Study Rooms', 'Laundry'],
    capacity: 500,
    hasStudyRooms: true,
    hasDining: true,
  },
  {
    id: 'rockefeller',
    name: 'Rockefeller College',
    type: 'residential',
    position: [-40, 0, 0],
    size: [25, 15, 20],
    color: '#b89968',
    style: 'collegiate-gothic',
    description: 'Residential college known for its courtyard and community spirit',
    amenities: ['Dining Hall', 'Common Room', 'Study Rooms', 'Music Practice Rooms'],
    capacity: 480,
    hasStudyRooms: true,
    hasDining: true,
  },
  {
    id: 'butler',
    name: 'Butler College',
    type: 'residential',
    position: [40, 0, -30],
    size: [25, 15, 20],
    color: '#9b8b7e',
    style: 'modern',
    description: 'Modern residential college with sustainable design',
    amenities: ['Dining Hall', 'Theater', 'Study Lounges', 'Game Room'],
    capacity: 500,
    hasStudyRooms: true,
    hasDining: true,
  },
  {
    id: 'wilson',
    name: 'Wilson College',
    type: 'residential',
    position: [40, 0, 0],
    size: [28, 16, 22],
    color: '#a8a8a8',
    style: 'modern',
    description: 'Largest residential college with modern amenities',
    amenities: ['Dining Hall', 'Café', 'Gym', 'Study Spaces', 'Art Studio'],
    capacity: 550,
    hasStudyRooms: true,
    hasDining: true,
    hasCafe: true,
  },
  {
    id: 'whitman',
    name: 'Whitman College',
    type: 'residential',
    position: [0, 0, -60],
    size: [30, 18, 25],
    color: '#deb887',
    style: 'collegiate-gothic',
    description: 'Beautiful Gothic residential college with courtyard',
    amenities: ['Dining Hall', 'Library', 'Theater', 'Dance Studio'],
    capacity: 520,
    hasStudyRooms: true,
    hasDining: true,
  },
  {
    id: 'forbes',
    name: 'Forbes College',
    type: 'residential',
    position: [-70, 0, -60],
    size: [22, 14, 18],
    color: '#8b7355',
    style: 'modern',
    description: 'Off-center residential college with unique character',
    amenities: ['Dining Hall', 'Den', 'Study Rooms', 'Performance Space'],
    capacity: 450,
    hasStudyRooms: true,
    hasDining: true,
  },
];

// ACADEMIC BUILDINGS
export const academicBuildings: Building[] = [
  {
    id: 'nassau-hall',
    name: 'Nassau Hall',
    type: 'administrative',
    position: [0, 0, 40],
    size: [28, 14, 10],
    color: '#e0caa8',
    style: 'colonial',
    description: 'Historic centerpiece of Princeton, oldest building on campus (1756)',
    amenities: ['Administration', 'Faculty Offices', 'Historic Tour'],
  },
  {
    id: 'mccosh-hall',
    name: 'McCosh Hall',
    type: 'academic',
    position: [20, 0, 5],
    size: [14, 12, 10],
    color: '#b89968',
    style: 'collegiate-gothic',
    description: 'Humanities and social sciences classrooms',
    amenities: ['Lecture Halls', 'Seminar Rooms', 'Faculty Offices'],
    hasStudyRooms: true,
  },
  {
    id: '1903-hall',
    name: '1903 Hall',
    type: 'academic',
    position: [-20, 0, 5],
    size: [14, 12, 10],
    color: '#c9b899',
    style: 'collegiate-gothic',
    description: 'Humanities classrooms and lecture halls',
    amenities: ['Classrooms', 'Lecture Halls', 'Study Spaces'],
    hasStudyRooms: true,
  },
  {
    id: 'robertson-hall',
    name: 'Robertson Hall',
    type: 'academic',
    position: [60, 0, 30],
    size: [18, 14, 15],
    color: '#9b8468',
    style: 'modern',
    description: 'Woodrow Wilson School of Public and International Affairs',
    amenities: ['Lecture Halls', 'Library', 'Conference Rooms'],
    hasStudyRooms: true,
  },
  {
    id: 'friend-center',
    name: 'Friend Center',
    type: 'academic',
    position: [65, 0, -20],
    size: [22, 15, 18],
    color: '#a8a8a8',
    style: 'modern',
    description: 'Engineering and computer science building',
    amenities: ['Computer Labs', 'Classrooms', 'Maker Space', 'Study Lounges'],
    hasStudyRooms: true,
  },
  {
    id: 'whig-hall',
    name: 'Whig Hall',
    type: 'administrative',
    position: [-18, 0, 28],
    size: [16, 14, 16],
    color: '#f5f5dc',
    style: 'classical',
    description: 'Historic debating society hall with stunning rotunda',
    amenities: ['Meeting Rooms', 'Historic Hall'],
  },
  {
    id: 'clio-hall',
    name: 'Clio Hall',
    type: 'administrative',
    position: [18, 0, 28],
    size: [16, 14, 16],
    color: '#f5f5dc',
    style: 'classical',
    description: 'Historic debating society hall, twin to Whig Hall',
    amenities: ['Meeting Rooms', 'Historic Hall'],
  },
  {
    id: 'blair-arch',
    name: 'Blair Arch',
    type: 'academic',
    position: [-30, 0, 15],
    size: [20, 16, 10],
    color: '#c9b899',
    style: 'collegiate-gothic',
    description: 'Iconic archway and academic building',
    amenities: ['Classrooms', 'Historic Arch'],
  },
  {
    id: 'east-pyne',
    name: 'East Pyne Hall',
    type: 'academic',
    position: [30, 0, 45],
    size: [18, 20, 12],
    color: '#b89968',
    style: 'collegiate-gothic',
    description: 'Victorian Gothic building with distinctive tower',
    amenities: ['Classrooms', 'Offices'],
  },
];

// LIBRARIES
export const libraries: Building[] = [
  {
    id: 'firestone',
    name: 'Firestone Library',
    type: 'library',
    position: [0, 0, 70],
    size: [35, 20, 15],
    color: '#9b8b7e',
    style: 'collegiate-gothic',
    description: 'Main university library with extensive study spaces',
    amenities: ['Study Rooms', 'Reading Rooms', 'Special Collections', 'Café'],
    hasStudyRooms: true,
    hasCafe: true,
    openHours: '8am-2am',
  },
  {
    id: 'chancellor-green',
    name: 'Chancellor Green',
    type: 'library',
    position: [35, 0, 55],
    size: [20, 14, 20],
    color: '#c9b899',
    style: 'classical',
    description: 'Rotunda library with beautiful reading room',
    amenities: ['Reading Room', 'Study Spaces'],
    hasStudyRooms: true,
    openHours: '9am-midnight',
  },
  {
    id: 'lewis-science',
    name: 'Lewis Science Library',
    type: 'library',
    position: [60, 0, 50],
    size: [18, 12, 14],
    color: '#a8a8a8',
    style: 'modern',
    description: 'Science and engineering library',
    amenities: ['Study Rooms', 'Computer Lab', 'Group Study'],
    hasStudyRooms: true,
    openHours: '8am-2am',
  },
];

// DINING & CAFES
export const diningAndCafes: Building[] = [
  {
    id: 'frist',
    name: 'Frist Campus Center',
    type: 'dining',
    position: [-40, 0, 15],
    size: [20, 14, 18],
    color: '#a8a8a8',
    style: 'modern',
    description: 'Main student center with dining, café, and meeting spaces',
    amenities: ['Food Court', 'Café', 'Theater', 'Meeting Rooms', 'Post Office'],
    hasCafe: true,
    hasDining: true,
    openHours: '7am-2am',
  },
  {
    id: 'small-world',
    name: 'Small World Coffee',
    type: 'cafe',
    position: [-8, 0, 20],
    size: [8, 6, 8],
    color: '#8b6f47',
    style: 'modern',
    description: 'Popular student café, great for studying and socializing',
    amenities: ['Coffee', 'Pastries', 'WiFi', 'Seating'],
    hasCafe: true,
    openHours: '7am-midnight',
  },
  {
    id: 'starbucks-frist',
    name: 'Starbucks',
    type: 'cafe',
    position: [-38, 0, 12],
    size: [6, 5, 6],
    color: '#00704a',
    style: 'modern',
    description: 'Starbucks inside Frist Campus Center',
    amenities: ['Coffee', 'Snacks', 'WiFi'],
    hasCafe: true,
    openHours: '7am-10pm',
  },
  {
    id: 'chancellor-cafe',
    name: 'Chancellor Café',
    type: 'cafe',
    position: [33, 0, 58],
    size: [6, 5, 6],
    color: '#c9b899',
    style: 'classical',
    description: 'Quiet café near Chancellor Green Library',
    amenities: ['Coffee', 'Light Meals', 'Study Space'],
    hasCafe: true,
    openHours: '8am-8pm',
  },
];

// EATING CLUBS (Prospect Avenue)
export const eatingClubs: Building[] = [
  {
    id: 'ivy',
    name: 'Ivy Club',
    type: 'eating-club',
    position: [50, 0, -10],
    size: [12, 10, 12],
    color: '#9b8468',
    style: 'colonial',
    description: 'Oldest eating club, selective',
    amenities: ['Dining', 'Social Events'],
    hasDining: true,
  },
  {
    id: 'tiger-inn',
    name: 'Tiger Inn',
    type: 'eating-club',
    position: [50, 0, 5],
    size: [12, 10, 12],
    color: '#ff8c00',
    style: 'colonial',
    description: 'Known for orange building and spirited social scene',
    amenities: ['Dining', 'Bar', 'Social Events'],
    hasDining: true,
  },
  {
    id: 'cottage',
    name: 'Cottage Club',
    type: 'eating-club',
    position: [50, 0, 20],
    size: [12, 10, 12],
    color: '#deb887',
    style: 'victorian',
    description: 'Victorian-style eating club',
    amenities: ['Dining', 'Library', 'Billiards'],
    hasDining: true,
  },
  {
    id: 'cap-and-gown',
    name: 'Cap and Gown',
    type: 'eating-club',
    position: [50, 0, 35],
    size: [12, 10, 12],
    color: '#b8956a',
    style: 'colonial',
    description: 'All-gender eating club',
    amenities: ['Dining', 'Social Events'],
    hasDining: true,
  },
  {
    id: 'colonial',
    name: 'Colonial Club',
    type: 'eating-club',
    position: [50, 0, 50],
    size: [12, 10, 12],
    color: '#e0caa8',
    style: 'colonial',
    description: 'Sign-in eating club with welcoming atmosphere',
    amenities: ['Dining', 'Game Room'],
    hasDining: true,
  },
  {
    id: 'tower',
    name: 'Tower Club',
    type: 'eating-club',
    position: [65, 0, -10],
    size: [12, 10, 12],
    color: '#c9b899',
    style: 'collegiate-gothic',
    description: 'Selective eating club',
    amenities: ['Dining', 'Social Events'],
    hasDining: true,
  },
  {
    id: 'cloister',
    name: 'Cloister Inn',
    type: 'eating-club',
    position: [65, 0, 5],
    size: [12, 10, 12],
    color: '#9b8b7e',
    style: 'modern',
    description: 'Sign-in eating club with modern vibe',
    amenities: ['Dining', 'Music Room'],
    hasDining: true,
  },
  {
    id: 'terrace',
    name: 'Terrace Club',
    type: 'eating-club',
    position: [65, 0, 20],
    size: [12, 10, 12],
    color: '#a89988',
    style: 'modern',
    description: 'Progressive sign-in eating club',
    amenities: ['Dining', 'Vegetarian Options', 'Live Music'],
    hasDining: true,
  },
];

// RELIGIOUS & CULTURAL
export const religiousBuildings: Building[] = [
  {
    id: 'chapel',
    name: 'University Chapel',
    type: 'religious',
    position: [-35, 0, 50],
    size: [15, 28, 35],
    color: '#b5a897',
    style: 'collegiate-gothic',
    description: 'Gothic Revival chapel with stunning architecture',
    amenities: ['Services', 'Concerts', 'Meditation Space'],
  },
];

// ATHLETICS
export const athleticBuildings: Building[] = [
  {
    id: 'dillon-gym',
    name: 'Dillon Gymnasium',
    type: 'athletics',
    position: [-60, 0, 30],
    size: [25, 18, 22],
    color: '#8b8b8b',
    style: 'modern',
    description: 'Main gymnasium with courts and fitness facilities',
    amenities: ['Basketball Courts', 'Fitness Center', 'Pool', 'Locker Rooms'],
    openHours: '6am-midnight',
  },
  {
    id: 'jadwin-gym',
    name: 'Jadwin Gymnasium',
    type: 'athletics',
    position: [-55, 0, 60],
    size: [30, 22, 28],
    color: '#a8a8a8',
    style: 'modern',
    description: 'Large athletic complex',
    amenities: ['Arena', 'Squash Courts', 'Track', 'Training Rooms'],
    openHours: '6am-midnight',
  },
];

// Combine all buildings
export const allBuildings: Building[] = [
  ...residentialColleges,
  ...academicBuildings,
  ...libraries,
  ...diningAndCafes,
  ...eatingClubs,
  ...religiousBuildings,
  ...athleticBuildings,
];

// Building lookup by type
export const getBuildingsByType = (type: Building['type']): Building[] => {
  return allBuildings.filter(b => b.type === type);
};

// Find nearest buildings by type
export const findNearestBuildings = (
  position: [number, number, number],
  type: Building['type'],
  limit: number = 3
): Building[] => {
  return allBuildings
    .filter(b => b.type === type)
    .map(b => ({
      building: b,
      distance: Math.sqrt(
        Math.pow(b.position[0] - position[0], 2) +
        Math.pow(b.position[2] - position[2], 2)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.building);
};

// Find buildings with specific amenities
export const findBuildingsWithAmenity = (amenity: string): Building[] => {
  return allBuildings.filter(b => 
    b.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
  );
};

// Get all study locations
export const getStudyLocations = (): Building[] => {
  return allBuildings.filter(b => b.hasStudyRooms);
};

// Get all cafes
export const getAllCafes = (): Building[] => {
  return allBuildings.filter(b => b.hasCafe);
};

// Get all dining locations
export const getDiningLocations = (): Building[] => {
  return allBuildings.filter(b => b.hasDining);
};
