export interface ChatMessage {
  _id?: string;
  room: string;
  username: string;
  text: string;
  createdAt?: string;
}
