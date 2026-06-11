import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientLayout from './ClientLayout';

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const operatorEmail = cookieStore.get('operator_email');
  const adminLoggedIn = cookieStore.get('admin_logged_in');
  const userRole = cookieStore.get('user_role');
  
  if ((!operatorEmail || !operatorEmail.value) && (!adminLoggedIn || adminLoggedIn.value !== 'true')) {
    redirect('/login?tab=operator');
  }
  
  return <ClientLayout>{children}</ClientLayout>;
}
