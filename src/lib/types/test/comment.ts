import { CommentDTO } from '../dto/comment';

export interface TestModeConfig {
  isTestMode: boolean;
  currentNickname: string;
}

export interface TestModeProps {
  isTestMode?: boolean;
} 