import Image from 'next/image';
import Logo from '@/assets/logo-icon.svg';
import { useRouter } from 'next/navigation';

export const LogoIcon = () => {
    const router = useRouter();
    return (
        <Image
            src={Logo}
            height={40}
            width={40}
            className='rounded-lg mb-1 hover:cursor-pointer'
            alt='logo'
            onClick={() => router.push('/')}
        />
    );
};