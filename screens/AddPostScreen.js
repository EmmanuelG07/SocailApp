import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigations/AuthProvider';
import {
  AddImage,
  InputField,
  InputWrapper,
  SubmitBtnText,
  SubmitBtn,
  StatusWrapper,
} from '../styles/AddPost';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUpLoading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const actions = [
    // {
    //   text: 'Take photo',
    //   icon: require('../assets/floating/camera.png'),
    //   name: 'camera',
    //   position: 1,
    // },
    {
      text: 'Choose Photo',
      icon: require('../assets/floating/gallery.png'),
      name: 'gallery',
      position: 2,
    },
  ];

  // const takePhotoFromCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then((image) => {
  //     console.log(image);
  //     const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
  //     setImage(imageUri);
  //   });

  // };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('post:', post);

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        Comments: null,
      })

      .then(() => {
        console.log('Post Added!');
        Alert.alert(
          'Post published',
          'Your post has been published Successfully!!',
        );
        setPost(null);
      })

      .catch(error => {
        console.log('Something went wrong with added post to firebase', error);
      });
  };

  const uploadImage = async () => {

    if(image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    //Add timestamp to prevent over write.
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUpLoading(true);
    setTransferred(0);

    // create folder in firebase console
    const storageRef = storage().ref(`photos/${filename}`);

    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUpLoading(false);
      // Alert.alert(
      //   'Image uploaded!',
      //   'Your Image has been uploaded to the Firebase Cloud Successfully!!',
      // );

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }

    setImage(null);
  };

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="what's on your mind?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={content => setPost(content)}
        />

        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>

      <FloatingAction
        actions={actions}
        onPressItem={choosePhotoFromLibrary}
        color={'red'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});


export default AddPostScreen;
