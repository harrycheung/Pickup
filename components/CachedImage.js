
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { FileSystem } from 'expo';

import * as C from '../config/constants';
import { FBstorageRef } from '../helpers/firebase';

class CachedImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localUri: '',
    };
  }

  state: {
    localUri: string,
  }
  async componentWillMount() {
    this._downloadImage(this.props.source.uri);
    this.mounted = true;
  }

  async componentWillReceiveProps(nextProps) {
    this._downloadImage(nextProps.source.uri);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean

  async _downloadImage(image) {
    const filename = image === C.NoProfile ? 'noprofile' : image;
    // NOTE: For some reason cacheDirectory is a url escaped path.
    const localUri = `${FileSystem.cacheDirectory}Image-${filename}.png`;
    if (this.state.localUri !== localUri) {
      const { exists } = await FileSystem.getInfoAsync(localUri);
      if (exists) {
        // If logged in
        if (this.props.user !== null && this.mounted) {
          this.setState({ localUri });
        }
      } else {
        let uri = C.NoProfile;
        // If logged in
        if (this.props.user !== null && filename !== 'noprofile') {
          await FBstorageRef(`images/${image}`).getDownloadURL()
            .then((remoteUri) => {
              uri = remoteUri;
            });
        }
        await FileSystem.downloadAsync(uri, localUri)
          .then(() => {
            if (this.props.user !== null && this.mounted) {
              // If logged in
              this.setState({ localUri });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  render() {
    if (this.state.localUri === '') {
      return <View {...this.props} />;
    }
    return <Image {...this.props} source={{ uri: this.state.localUri }} />;
  }
}

CachedImage.propTypes = {
  user: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(CachedImage);
