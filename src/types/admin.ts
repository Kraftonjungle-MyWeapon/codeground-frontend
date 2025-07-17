export interface AdminProblemOut {
  problem_id: number;
  title: string;
  difficulty: string;
  is_approved: boolean;
  created_at: string;
  author_id: number;
  category: string[];
  language: string[];
}

export interface AdminProblemDetailOut extends AdminProblemOut {
  problem_url: string;
  image_urls: string[];
  problem_prefix: string;
  testcase_prefix: string;
}
