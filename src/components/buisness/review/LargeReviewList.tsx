import FeedReviewItem from './LargeReviewItem';

interface Review {
  reviewId: number;
  title: string;
  content: string;
  userDataResponse: {
    nickname: string;
    profileImage: string;
  };
  thumbnailUrl: string;
  imageUrls: string[];
}

const LargeReviewList: React.FC<Review> = ({}) => {
  return (
    <div>
      <FeedReviewItem reviewId={1} />
      <FeedReviewItem reviewId={2} />
    </div>
  );
};

export default LargeReviewList;
