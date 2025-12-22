import { Metadata } from 'next';
import DashboardView from './dashboard-view';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Overview of your eGlobalSphere operations and metrics.',
};

export default function DashboardPage() {
    return <DashboardView />;
}
