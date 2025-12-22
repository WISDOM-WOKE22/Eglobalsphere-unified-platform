import { Metadata } from 'next';
import LoginView from './login-view';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your eGlobalSphere account to manage operations.',
};

export default function LoginPage() {
    return <LoginView />;
}
