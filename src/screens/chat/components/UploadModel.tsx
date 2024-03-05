import React, { memo } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  sendMessage: (v: any) => void;
};
const array = [
  {
    name: 'Document',
    image: require('../../../assets/images/uploads/document.jpg'),
  },
  {
    name: 'Camera',
    image: require('../../../assets/images/uploads/camera.jpg'),
  },
  {
    name: 'Gallery',
    image: require('../../../assets/images/uploads/gallery.jpg'),
  },
  { name: 'Audio', image: require('../../../assets/images/uploads/audio.jpg') },
  {
    name: 'Location',
    image: require('../../../assets/images/uploads/location.jpg'),
  },
  {
    name: 'Payment',
    image: require('../../../assets/images/uploads/payment.jpg'),
  },
  {
    name: 'Contact',
    image: require('../../../assets/images/uploads/contact.jpg'),
  },
  { name: 'Poll', image: require('../../../assets/images/uploads/poll.jpg') },
];

const UploadModel = ({ open, setOpen, sendMessage }: Props) => {
  const handleClick = async (type: string) => {
    if (type === 'Gallery') {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        maxWidth: 800,
        maxHeight: 600,
      });

      const imageData = result?.assets?.[0];
      if (imageData) {
        sendMessage({
          uri: imageData.uri,
          type: imageData.type,
          name: imageData.fileName,
        });
      }
      return;
    }
    if (type === 'Camera') {
      const result = await launchCamera({
        mediaType: 'mixed',
        maxWidth: 800,
        maxHeight: 600,
      });
      const imageData = result?.assets?.[0];
      if (imageData) {
        sendMessage({
          uri: imageData.uri,
          type: imageData.type,
          name: imageData.fileName,
        });
      }
      return;
    }
  };

  return (
    <View className="relative">
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.modelBackdrop}
          onPress={() => setOpen(false)}>
          <View style={styles.modalView}>
            <FlatList
              data={array}
              numColumns={3}
              ItemSeparatorComponent={() => <View className="h-2" />}
              renderItem={({ item: { name, image } }) => (
                <TouchableOpacity
                  style={styles.itemView}
                  onPress={() => handleClick(name)}>
                  <Image className="w-[55px] h-[55px]" source={image} />
                  <Text style={styles.itemText}>{name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    marginHorizontal: '6%',
    position: 'absolute',
    bottom: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26343e',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: '13%',
    width: '88%',
  },

  modelBackdrop: { flex: 1 },
  itemView: {
    minWidth: '33%',
    alignItems: 'center',
    zIndex: 2,
  },

  itemText: {
    color: '#8596a0',
    fontSize: 11,
    marginTop: 2,
  },
});
export default memo(UploadModel);
