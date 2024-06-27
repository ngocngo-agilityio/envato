import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('@/ui/sections/SignUp'));

export default SignUp;
