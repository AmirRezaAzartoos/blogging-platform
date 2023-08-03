export interface IPost {
  id?: string;
  content: string;
  author: string;
  publicationDate: Date;
  tags: Array<string>;
}
