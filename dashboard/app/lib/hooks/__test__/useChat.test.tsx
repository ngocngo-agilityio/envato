import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDocs } from 'firebase/firestore';

// Services
import { getAllUserDetailsExceptWithId } from '@/lib/services';

// Constants
import { AUTHENTICATION_ROLE } from '@/lib/constants';

// Hooks
import { getCurrentUser, getLists, useGetRoomChat } from '@/lib/hooks';

// Mocks
import { MOCK_USER_DETAIL } from '@/lib/mocks';

// Stores
import { authStore } from '@/lib/stores';

// Mock services
jest.mock('@/lib/services', () => ({
  getAllUserDetailsExceptWithId: jest.fn(),
}));

jest.mock('@/lib/stores', () => ({
  authStore: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockAdmin = {
  uid: 'uidAdmin456',
  role: AUTHENTICATION_ROLE.SUPER_ADMIN,
  avatarURL: 'http://example.com/adminAvatar.jpg',
};

(getAllUserDetailsExceptWithId as jest.Mock).mockResolvedValue([mockAdmin]);

describe('useGetRoomChat', () => {
  it('returns the combined ID of the current user and admin user', () => {
    const mockUser = { id: 'user123' };

    (authStore as unknown as jest.Mock).mockImplementation((callback) =>
      callback({ user: mockUser }),
    );

    const { result } = renderHook(() => useGetRoomChat(), { wrapper });

    expect(result.current).toEqual('user123undefined');
  });
});

describe('getCurrentUser', () => {
  it('returns detailed information for the current user and admin', async () => {
    const result = await getCurrentUser(MOCK_USER_DETAIL);

    const expected = {
      roomChatId: 'GmCJFXqXubfAPdKs56C4Sq7DisY21',
      userId: '1',
      adminId: 'GmCJFXqXubfAPdKs56C4Sq7DisY2',
      avatarUrl: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
      avatarAdminUrl: 'https://i.ibb.co/s60bn5S/avatar-sign-up.webp',
      displayName: 'Abdur Rohman ',
    };

    expect(result).toEqual(expected);
  });

  //TODO: skip case because waiting for API
  it.skip('returns null or appropriate value when no user is found', async () => {
    (getAllUserDetailsExceptWithId as jest.Mock).mockResolvedValue([]);

    const result = await getCurrentUser(MOCK_USER_DETAIL);

    expect(result).toEqual(undefined);
  });
});

describe('getLists', () => {
  it('fetches and processes chat lists correctly', async () => {
    const mockUsersSnapshot = {
      docs: [
        { id: '1', data: () => ({ chat: 'Chat 1' }) },
        { id: '2', data: () => ({ chat: 'Chat 2' }) },
      ],
    };

    (getDocs as jest.Mock).mockResolvedValue(mockUsersSnapshot);

    const result = await getLists();

    const expected = {
      chatList: ['Chat 1', 'Chat 2'],
    };

    expect(result).toEqual(expected);
  });
});
