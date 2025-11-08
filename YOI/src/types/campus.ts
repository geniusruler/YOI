export interface EatingClub {
  id: string;
  name: string;
  nickname?: string;
  founded: number;
  type: 'bicker' | 'sign-in';
  position: [number, number, number];
  rotation: number;
  style: 'colonial' | 'gothic' | 'tudor' | 'modern' | 'victorian';
  color: string;
  size: 'small' | 'medium' | 'large';
  description: string;
  features: string[];
}

export interface Building3DProps {
  position: [number, number, number];
  rotation: number;
  style: string;
  color: string;
  size: string;
  isSelected?: boolean;
  onClick?: () => void;
}
