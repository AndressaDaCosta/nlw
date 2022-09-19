
import { ImageBackground } from 'react-native';

import backgroundIMg from '../../assets/background-galaxy.png';

import { styles } from './styles';

interface Props {
  children: React.ReactNode;
}

export function Background({children}: Props) {
  return (
    <ImageBackground 
      source={backgroundIMg}
      defaultSource={backgroundIMg}
      style={styles.container}
    >
      {children}
    </ImageBackground>
  );
}