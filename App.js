import { StatusBar } from 'expo-status-bar';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import { WebView } from 'react-native-webview';
import {SafeAreaView} from "react-native-web";

export default function App() {
  return (
    <View style={styles.container}>
      <WebView scalesPageToFit={true} style = {{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} allowUniversalAccessFromFileURLs originWhitelist = {['*']} source = {{ uri: 'http://localhost:3005/' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  },
});
