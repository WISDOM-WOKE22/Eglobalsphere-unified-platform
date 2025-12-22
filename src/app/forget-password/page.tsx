import { Metadata } from 'next';
import ForgottenPasswordView from './forget-password-view';

export const metadata: Metadata = {
    title: 'Foreign Password',
    description: 'Recover your access to eGlobalSphere.',
};

export default function ForgottenPasswordPage() {
    return <ForgottenPasswordView />;
}
