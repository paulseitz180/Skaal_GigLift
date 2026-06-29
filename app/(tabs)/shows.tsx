import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/ui/EmptyState';

export default function ShowsScreen() {
  const router = useRouter();

  return (
    <EmptyState
      title="No shows on the calendar yet"
      message="Let's promote your next gig. Tell GigLift about a show and it'll build the whole campaign for you."
      action={{ label: 'Plan a New Show', onPress: () => router.push('/voice-input') }}
    />
  );
}
