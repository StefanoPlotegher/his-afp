export interface APIResponse <T> {
  status: string;
  results?: number;
  data: T;
}
