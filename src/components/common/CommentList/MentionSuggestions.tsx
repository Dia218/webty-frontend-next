// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// interface MentionSuggestionsProps {
//   suggestions: (string | User)[];
//   onSelect: (nickname: string) => void;
//   position: { top: number; left: number };
//   isTestMode?: boolean;
// }

// export default function MentionSuggestions({
//   suggestions,
//   onSelect,
//   position,
//   isTestMode = false,
// }: MentionSuggestionsProps) {
//   if (suggestions.length === 0) return null;

//   return (
//     <div
//       className="absolute z-50 max-h-40 w-64 overflow-auto rounded-lg border bg-white shadow-lg"
//       style={{
//         bottom: '100%',
//         left: '0',
//         marginBottom: '8px',
//       }}
//     >
//       {suggestions.map((suggestion, index) => {
//         const nickname =
//           typeof suggestion === 'string' ? suggestion : suggestion.nickname;
//         const profileImage =
//           typeof suggestion === 'string' ? null : suggestion.profileImage;

//         return (
//           <button
//             key={index}
//             className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50"
//             onClick={(e) => {
//               e.preventDefault();
//               onSelect(nickname);
//             }}
//           >
//             <Avatar className="h-6 w-6">
//               <AvatarImage
//                 src={profileImage || '/default-profile.png'}
//                 alt={nickname}
//               />
//               <AvatarFallback>{nickname[0]}</AvatarFallback>
//             </Avatar>
//             <span>{nickname}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }
