import { Redirect, Slot } from 'expo-router';
import { SessionProvider, useSession } from '../ctx';

export default function Root() {
  const { session } = useSession();

  if (session) {
      return <Redirect href="/(app)/" />;
  }

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
