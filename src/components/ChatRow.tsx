import AppleStyleSwipeableRow from '@/components/AppleStyleSwipeableRow';
import { Colors } from '@/constants/Colors';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { FC } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface ChatRowProps {
  id: string;
  from: string;
  date: number;
  img: string;
  msg: string;
}

const ChatRow: FC<ChatRowProps> = ({ id, from, date, img, msg }) => {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? 'light'];

  return (
    <AppleStyleSwipeableRow>
      <Link href={`/(tabs)/chats/${id}`} asChild>
        <TouchableHighlight activeOpacity={0.8} underlayColor={currentColors.lightGray}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingLeft: 20,
              paddingVertical: 10,
            }}>
            <Image source={{ uri: "https://gravatar.com/avatar/3260af57664a5d3271948d3d8dad1df6?s=400&d=robohash&r=x" }} style={{ width: 50, height: 50, borderRadius: 50 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{from}</Text>
              <Text style={{ fontSize: 16, color: currentColors.gray }}>
                {msg.length > 40 ? `${msg.substring(0, 40)}...` : msg}
              </Text>
            </View>
            <Text style={{ color: currentColors.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
              {format(new Date(date), 'MM.dd.yy')}
            </Text>
          </View>
        </TouchableHighlight>
      </Link>
    </AppleStyleSwipeableRow>
  );
};

export default ChatRow;
