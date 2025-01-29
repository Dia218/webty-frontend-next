import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import MyInfo from '@/components/business/MyInfo/MyInfo';

export default function MyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="flex-grow container mx-auto p-4">
        <MyInfo />
      </main>
    </div>
  );
}
