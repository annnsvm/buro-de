type CurrentUser = {
    id: string;
    email: string;
    name?: string;
    role: 'student' | 'teacher';
    language: string;
    avatarUrl?: string;
    displayName?: string;
    timezone?: string;
    level?: string;
    bio?: string;
    isActive?: boolean;
  };
  
  export type { CurrentUser };
  