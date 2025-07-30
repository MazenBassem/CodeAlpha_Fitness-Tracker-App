export interface Activity{
    task_id: string,
    user_id: string,
    title: string,
    description: string,
    frequency: string,
    streak_count: number,
    last_completed: string,
    created_at: string,
}

export interface ActivityCompletion {
  id: string;
  user_id: string;
//   activity_id: string;
  completed_at: string;
}

export interface DBUser{
    user_id: string,
    username: string,
    full_name: string,
    avatar_url: string,
    updated_at: string,
}
