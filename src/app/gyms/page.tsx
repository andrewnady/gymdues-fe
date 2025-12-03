import { getAllGyms } from '@/lib/gyms-api';
import { GymCard } from '@/components/gym-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default async function GymsPage() {
  let gyms = [];
  try {
    gyms = await getAllGyms();
  } catch (error) {
    console.error('Failed to load gyms:', error);
    // You could show an error message to the user here
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Gyms</h1>
          <p className="text-muted-foreground mb-6">
            Discover fitness centers in your area
          </p>
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gyms..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>

        {gyms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gyms found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

