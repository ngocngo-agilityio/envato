import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';

// Constants
import {
  AUTHENTICATION_ROLE,
  END_POINTS,
  FIREBASE_CHAT,
} from '@/lib/constants';

// Stores
import { authStore } from '@/lib/stores';

// Firebase
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';

// Utils
import { db } from '@/lib/utils';

// Service
import { mainHttpService } from '@/lib/services';

// Mocks
import { MOCK_SUPER_ADMIN } from '../mocks';

// Interface
import { TUserInfo, useGetUserDetails } from '.';
import { TMessages, TUserDetail } from '@/lib/interfaces';

export type AdminDetailsResponse = Omit<TUserDetail, 'id'> & {
  _id: string;
};

// TODO: if have real id from firestore
export const useGetRoomChat = () => {
  const user = authStore((state) => state.user);
  const { filterDataUser } = useGetUserDetails(user?.id || '');

  const isAdmin = filterDataUser?.find(
    (user) => user.role === AUTHENTICATION_ROLE.SUPER_ADMIN,
  );

  const adminUserId = isAdmin?._id;
  const comBindIdChat = `${user?.id || ''}${adminUserId}`;
  return comBindIdChat;
};

// Author: Loc Vo
export const getInfoRoomChat = async (user: Partial<TUserInfo>) => {
  const res = await mainHttpService.get<AdminDetailsResponse>({
    path: END_POINTS.ADMIN,
    userId: user?.id,
  });

  const { uid: adminId = '' } = res?.data || {};
  const {
    uid: userId = '',
    firstName: userFirstName = '',
    lastName: userLastName = '',
    avatarURL: userAvatarURL = '',
  } = user || {};

  return {
    roomChatId: `${adminId}${userId}`,
    userId,
    adminId,
    avatarUrl: userAvatarURL,
    avatarAdminUrl: MOCK_SUPER_ADMIN.avatarURL,
    displayName: `${userFirstName} ${userLastName} `,
  };
};

export const getLists = async () => {
  const usersCollection = collection(db, FIREBASE_CHAT.USER_CHATS);
  const usersSnapshot = await getDocs(usersCollection);

  const chatList = usersSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))
    .map((item) => Object.values(item.data)[0]) as [];

  return {
    chatList,
  };
};

export const useSubscribeToChat = (
  roomId: string,
  setMessages: Dispatch<SetStateAction<TMessages[]>>,
  boxRef?: MutableRefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (!roomId) return;

    const unSub = onSnapshot(
      doc(db, FIREBASE_CHAT.CHATS, roomId),
      async (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      },
    );

    if (boxRef?.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }

    return () => {
      unSub();
    };
  }, [setMessages, roomId, boxRef]);
};
