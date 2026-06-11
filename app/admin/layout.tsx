import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminLoggedIn = cookieStore.get('admin_logged_in');
  
  if (!adminLoggedIn || adminLoggedIn.value !== 'true') {
    redirect('/login?tab=admin');
  }
  
  return <>{children}</>;
}
