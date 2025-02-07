import { CommentDTO } from '@/lib/types/dto/comment';

export class TestModeStorage {
  private static instance: TestModeStorage | null = null;
  private comments: CommentDTO[] = [];
  private commentIdCounter: number = 1;

  private constructor() {
    this.initializeTestComments();
  }

  public static getInstance(): TestModeStorage {
    if (!TestModeStorage.instance) {
      TestModeStorage.instance = new TestModeStorage();
    }
    return TestModeStorage.instance;
  }

  private initializeTestComments() {
    const now = new Date().toISOString();
    
    // 첫 번째 댓글
    const comment1: CommentDTO = {
      commentId: this.getNextCommentId(),
      reviewId: 1,
      comment: "이 리뷰 정말 잘 읽었습니다!",
      createdAt: now,
      modifiedAt: now,
      depth: 0,
      parentId: null,
      childComments: [],
      mentionedUsernames: [],
      user: {
        userId: 1,
        nickname: "즐거운 판다",
        email: "test1@example.com",
        role: "USER",
        createdAt: now,
        modifiedAt: now,
        profileImageUrl: "/default-profile.png"
      }
    };

    // 두 번째 댓글
    const comment2: CommentDTO = {
      commentId: this.getNextCommentId(),
      reviewId: 1,
      comment: "저도 같은 생각이에요~",
      createdAt: now,
      modifiedAt: now,
      depth: 0,
      parentId: null,
      childComments: [],
      mentionedUsernames: [],
      user: {
        userId: 2,
        nickname: "행복한 토끼",
        email: "test2@example.com",
        role: "USER",
        createdAt: now,
        modifiedAt: now,
        profileImageUrl: "/default-profile.png"
      }
    };

    this.comments.push(comment1, comment2);
  }

  public getComments(reviewId: number): CommentDTO[] {
    return this.comments.filter(comment => comment.reviewId === reviewId);
  }

  public addComment(comment: CommentDTO): void {
    comment.commentId = this.getNextCommentId();
    const now = new Date().toISOString();
    comment.createdAt = now;
    comment.modifiedAt = now;
    comment.childComments = [];

    if (comment.parentId) {
      const parentComment = this.findComment(comment.parentId);
      if (parentComment) {
        comment.depth = 1;
        parentComment.childComments.push(comment);
      }
    } else {
      comment.depth = 0;
      this.comments.push(comment);
    }
  }

  public updateComment(commentId: number, content: string, mentionedUsernames: string[]): CommentDTO | undefined {
    let targetComment = this.findComment(commentId);

    if (!targetComment) {
      console.error(`댓글을 찾을 수 없습니다. ID: ${commentId}`);
      return undefined;
    }

    const now = new Date().toISOString();
    targetComment.comment = content;
    targetComment.mentionedUsernames = mentionedUsernames;
    targetComment.modifiedAt = now;

    return targetComment;
  }

  public deleteComment(commentId: number): void {
    const commentIndex = this.comments.findIndex(c => c.commentId === commentId);
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
    } else {
      for (const comment of this.comments) {
        const childIndex = comment.childComments.findIndex(c => c.commentId === commentId);
        if (childIndex !== -1) {
          comment.childComments.splice(childIndex, 1);
          break;
        }
      }
    }
  }

  private getNextCommentId(): number {
    return this.commentIdCounter++;
  }

  private findComment(commentId: number): CommentDTO | undefined {
    for (const comment of this.comments) {
      if (comment.commentId === commentId) {
        return comment;
      }
      const childComment = comment.childComments.find(c => c.commentId === commentId);
      if (childComment) {
        return childComment;
      }
    }
    return undefined;
  }
} 