export interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  description: string | null;
  language: string | null;
}