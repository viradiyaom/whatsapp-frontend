import { format } from 'date-fns';
import { memo } from 'react';
import { Text } from 'react-native';
import { CurrentMessageType } from '../ChatMessage';

const TextChat = ({ message, createdAt }: CurrentMessageType) => (
  <>
    <Text className="text-white text-[15.5px] mr-[63px]">{message}</Text>
    <Text className="text-[#a5aaad] text-[11px] absolute bottom-[3px] right-[8px]">
      {format(createdAt, ' hh:mm aa')}
    </Text>
  </>
);

export default memo(TextChat);
