import { styled } from 'nativewind';
import { memo } from 'react';
import { View, ViewProps } from 'react-native';

type ContainerType = ViewProps & {
  isCurrentUser: boolean;
  isSamePrevious: boolean;
};

const Container = ({
  style,
  children,
  isCurrentUser,
  isSamePrevious,
}: ContainerType) => (
  <View
    style={style}
    className={`mr-3 ml-3.5 w-auto relative ${
      isSamePrevious ? 'mt-0.5' : 'mt-2'
    } ${isCurrentUser ? 'bg-[#015c4b] self-end' : 'bg-[#1f2c33] self-start'}`}>
    {children}
    {!isSamePrevious && (
      <View
        className={`absolute top-0  border-b-transparent -z-10 border-b-[23px] ${
          isCurrentUser
            ? 'border-l-[#015c4b] border-l-[17px] right-[-8px]'
            : 'border-r-[#1f2c33] border-r-[17px] left-[-8px]'
        }`}
      />
    )}
  </View>
);

export default styled(memo(Container));
