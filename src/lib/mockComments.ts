export interface UserInfo {
  id: string;
  name: string;
  avatar_url: string;
}

export interface CommentNode {
  id: string;
  user: UserInfo;
  content: string;
  isSpoiler: boolean;
  createdAt: string;
  replies: CommentNode[];
}

export const mockComments: CommentNode[] = [
  {
    id: "c1",
    user: {
      id: "u1",
      name: "DiziUzmanı99",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    content: "İlk bölüm bence dizinin en iyi pilot bölümüydü. Atmosferi müthiş yansıtmışlar.",
    isSpoiler: false,
    createdAt: "2 saat önce",
    replies: [
      {
        id: "c1-r1",
        user: {
          id: "u2",
          name: "TheoryCrafter",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden",
        },
        content: "Kesinlikle katılıyorum ama karakterlerin gelişimi biraz aceleye getirilmiş gibiydi.",
        isSpoiler: false,
        createdAt: "1 saat önce",
        replies: [
          {
            id: "c1-r1-r1",
            user: {
              id: "u1",
              name: "DiziUzmanı99",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            },
            content: "İleride açılıyorlar merak etme, özellikle 3. bölümden sonra...",
            isSpoiler: true,
            createdAt: "30 dakika önce",
            replies: [],
          }
        ],
      }
    ],
  },
  {
    id: "c2",
    user: {
      id: "u3",
      name: "SpoilerciBey",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    },
    content: "O son sahnede hastanede uyanması ve etrafa bakışını hiç beklemiyordum. Orada anladım bazı şeyleri...",
    isSpoiler: true,
    createdAt: "5 saat önce",
    replies: [],
  },
  {
    id: "c3",
    user: {
      id: "u4",
      name: "Sıradanİzleyici",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    },
    content: "Sanırım sezonu tek oturuşta bitireceğim :)",
    isSpoiler: false,
    createdAt: "1 gün önce",
    replies: [],
  }
];
