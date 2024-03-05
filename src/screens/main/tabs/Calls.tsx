import Layout from 'components/Layout';
import React, { memo } from 'react';
import { Text } from 'react-native';

type Props = {};

const Calls = (props: Props) => {
  return (
    <Layout>
      <Text>Calls</Text>
    </Layout>
  );
};

export default memo(Calls);
