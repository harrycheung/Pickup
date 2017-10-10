
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { FileSystem } from 'expo';

import * as C from '../config/constants';

const extractFilename = uri => uri.split('images%2F')[1].split('?alt')[0];

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
  }

  async componentWillReceiveProps(nextProps) {
    this._downloadImage(nextProps.source.uri);
  }

  async _downloadImage(uri) {
    const filename = uri === C.NoProfile ? 'noprofile' : extractFilename(uri);
    // NOTE: For some reason cacheDirectory is a url escaped path.
    const localUri = `${FileSystem.cacheDirectory}Image-${filename}.png`;
    if (this.state.localUri !== localUri) {
      const { exists } = await FileSystem.getInfoAsync(localUri);
      if (exists) {
        this.setState({ localUri });
      } else {
        await FileSystem.downloadAsync(this.props.source.uri, localUri)
          .then(() => {
            this.setState({ localUri });
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
  source: PropTypes.object.isRequired,
};

export default CachedImage;
