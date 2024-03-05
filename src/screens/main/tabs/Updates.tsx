import Layout from 'components/Layout';
import React, { memo } from 'react';
import { Text } from 'react-native';

type Props = {};

const Updates = (props: Props) => {
  return (
    <Layout>
      <Text>Updates</Text>
    </Layout>
  );
};

export default memo(Updates);
