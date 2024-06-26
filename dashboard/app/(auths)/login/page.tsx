import dynamic from 'next/dynamic';

const AuthForm = dynamic(() => import('@/ui/sections/Login'));

export default AuthForm;
