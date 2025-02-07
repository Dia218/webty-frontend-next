import NavigationBar from "@/components/common/NavigationBar/NavigationBar";
import FeedReviewList from "@/components/buisness/review/FeedReviewItem";

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Welcome to My App</h1>
        <p className="mt-2">
          This is the main content area. You can add your page content here.
        </p>
      </main>      
    </div>
  );
}