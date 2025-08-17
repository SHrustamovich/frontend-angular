export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  streak: number;
  avatar: string;
  lastSeen: string;
  kepcoin: number;
  skillsRating: string;
  activityRating: string;
  challenges_rating?: string | number; 
  country?: string; 
  age?: number;
  contestsRating?: string | number;
}

export interface UserResponse {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: User[];
}

