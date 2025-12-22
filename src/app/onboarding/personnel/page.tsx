import { Metadata } from 'next';
import PersonnelView from './personnel-view';

export const metadata: Metadata = {
    title: 'Setup Account',
    description: 'Create your eGlobalSphere account.',
};

export default function PersonnelPage() {
    return <PersonnelView />;
}
